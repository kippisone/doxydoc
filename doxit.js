var fs = require('fs'),
    path = require('path');

var glob = require('glob'),
    dox = require('dox'),
    extend = require('node.extend');

var DoxitGroup = require('./modules/doxitGroup');

/**
 * Doxit document parser
 * @module Doxit parser
 */
module.exports = (function() {
    'use strict';

    /**
     * Doxit parser module
     * @constructor
     */
    var Doxit = function() {
        this.templateFile = path.join(__dirname, 'templates/purple/index.fire');
        this.registerMapperFuncs();
    };

    /**
     * Registers pagger functions
     */
    Doxit.prototype.registerMapperFuncs = function() {
        this.__mapperFuncs = {
            'js': require('./mapper/javascript.js'),
            'css': require('./mapper/css.js'),
            'less': require('./mapper/css.js')
        };
    };

    /**
     * Calls a mapper function
     * @param  {string} mapperKey File extension
     * @param  {object} data      Data to be passed to the mapper function
     */
    Doxit.prototype.callMapperFunc = function(mapperKey, thisValue, data) {
        mapperKey = mapperKey.replace(/^\./, '');
        var fn = this.__mapperFuncs[mapperKey];
        fn.call(thisValue, data);
    };

    Doxit.prototype.readFiles = function(files) {
        var options = {
            nodir: true
        };

        var doxFiles = [];

        if (typeof files === 'string') {
            files = [files];
        }

        files.forEach(function(file) {
            doxFiles = doxFiles.concat(glob.sync(file, options));
        });

        doxFiles = doxFiles.filter(function(file) {
            return !/\/node_modules\//.test(file);
        });

        // console.log(doxFiles);
        var res = files.map(this.parseFile.bind(this));
        return this.mapDoxResult(res);
    };

    /**
     * Parse a single file and returns the result
     * @param  {String} file filepath
     * @return {Object}      Returns a dox result
     */
    Doxit.prototype.parseFile = function(file) {
        var filepath = path.join(process.cwd(), file);
        var doxed = {
            file: file,
            data: dox.parseComments(fs.readFileSync(filepath, { encoding: 'utf8' }))
        };
        
        return doxed;
    };

    Doxit.prototype.mapDoxResult = function(doxed) {
        // fs.writeFile('dev-doxblock.json', JSON.stringify(doxed, true, '    '));

        var result = this.getMetaInfos();
        this.listing = [];
        doxed.forEach(function(doxFile) {
            var moduleName = doxFile.file;
            doxFile.ext = path.extname(doxFile.file);

            var data = doxFile.data.map(function(doxBlock) {
                var block = {};
                
                if (doxBlock.ignore) {
                    return;
                }

                fs.appendFileSync('dev-doxblock.json', 'Doxed block: ' + JSON.stringify(doxBlock, true, '    ') + '\n\n');

                block.tags = this.parseTags(doxBlock.tags);
                block.description = doxBlock.description;
                block.line = doxBlock.line;
                block.codeStart = doxBlock.codeStart;
                block.code = doxBlock.code;

                var res = extend(doxBlock, {
                    tagsArray: doxBlock.tags || [],
                });

                //Is module?
                if (res.tags.module) {
                    moduleName = res.tags.module;
                    return;
                }

                var groupName = moduleName;

                //Has @group tag
                if (doxBlock.group) {
                    groupName = doxBlock.group;
                }

                //Is method (js only)?
                if (doxFile.ext === '.js') {
                    if (doxBlock.ctx.type === 'method') {
                        block.tags.method = block.tags.method || doxBlock.ctx.name;
                    }
                }

                fs.appendFileSync('dev-doxblock.json', 'Mapped to: ' + JSON.stringify(block, true, '    ') + '\n\n');
                
                return block;
            }.bind(this));
            
            var res = {
                file: doxFile.file,
                setGroup: this.setGroup.bind(this),
                grepPattern: this.grepPattern.bind(this),
                grepDataTypes: this.grepDataTypes.bind(this)
            };
            
            this.callMapperFunc(path.extname(doxFile.file), res, data);
        }.bind(this));

        result.listing = this.listing;
        return result;
    };

    Doxit.prototype.getMetaInfos = function() {
        var files = ['doxit.json', 'package.json'],
            dir,
            meta = {},
            file;

        for (var i = 0, len = files.length; i < len; i++) {
            dir = process.cwd();
            while(dir !== '/') {
                file = path.join(dir, files[i]);
                if (fs.existsSync(file)) {
                    if (files[i] === 'doxit.json') {
                        meta = require(file);
                    }
                    else {
                        var pkg = require(file);
                        meta.name = meta.name || pkg.name;
                        meta.version = meta.version || pkg.version;
                        meta.description = meta.description || pkg.description;
                    }
                }

                dir = path.join(dir, '..');
            }
        }

        return meta;
    };

    Doxit.prototype.setGroup = function(groupName, onCreateGroup) {
        var group;

        for (var i = 0, len = this.listing.length; i < len; i++) {
            if (this.listing[i].name === groupName) {
                return this.listing[i];
            }
        }

        group = new DoxitGroup(groupName);
        this.listing.push(group);
        if (typeof(onCreateGroup) === 'function') {
            onCreateGroup.call(group);
        }

        return group;
    };

    Doxit.prototype.parseTags = function(tags) {
        var newTag = {};

        if (tags && Array.isArray(tags)) {
            tags.forEach(function(tag) {
                tag = extend(true, {}, tag);
                if (tag.type) {
                    if (tag.type === 'param') {
                        if (!newTag.params) {
                            newTag.params = [];
                        }

                        tag.type = tag.types.join(', ');
                        newTag.params.push(tag);
                    }
                    else if (tag.type === 'type') {
                        if (!newTag.types) {
                            newTag.types = [];
                        }

                        newTag.type = tag.types.join(', ');
                        newTag.types.push(tag);
                    }
                    else if (tag.type === 'example') {
                        if (!newTag.example) {
                            newTag.example = [];
                        }

                        newTag.example.push({
                            // title: '',
                            code: tag.string
                        });
                    }
                    else {
                        newTag[tag.type] = tag.string === '' ? true : tag.string;
                    }
                }
            });
        }

        return newTag;
    };

    Doxit.prototype.grepPattern = function(pattern, str, index) {
        index = index || 1;
        
        var match = str.match(pattern);
        if (match && match[index]) {
            return match[index];
        }

        return null;
    };

    /**
     * Greps data types from a type string.
     *
     * Removes trailing and leading curly braces and returns data types as an array
     * 
     * @param  {string} str Data type string
     * @return {array}     Returns data types array or an emptyy array
     */
    Doxit.prototype.grepDataTypes = function(str) {
        if (typeof str !== 'string' || str === '') {
            return [];
        }

        return str.replace(/^\{|\}$/g, '').split('|');
    };

    Doxit.prototype.grepDescription = function(description) {
        return description.full;
    };

    return Doxit;
})();