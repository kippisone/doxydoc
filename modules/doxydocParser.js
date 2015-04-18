var fs = require('fs'),
    path = require('path');

var glob = require('glob'),
    dox = require('dox'),
    extend = require('node.extend');

var DoxyDocGroup = require('./doxydocGroup'),
    FireTPL = require('firetpl');

/**
 * DoxyDoc document parser
 * @module DoxyDocParser
 */
module.exports = (function() {
    'use strict';

    /**
     * DoxyDocParser parser module
     * @constructor
     */
    var DoxyDocParser = function() {
        this.templateFile = path.join(__dirname, '../templates/lagoon/docu.fire');
        this.registerMapperFuncs();
        this.doxydocFile = this.doxydocFile || 'doxydoc.json';
    };

    /**
     * Registers pagger functions
     */
    DoxyDocParser.prototype.registerMapperFuncs = function() {
        this.__mapperFuncs = {
            'js': require('../mapper/javascript.js'),
            'css': require('../mapper/css.js'),
            'less': require('../mapper/css.js')
        };
    };

    /**
     * Calls a mapper function
     * @param  {string} mapperKey File extension
     * @param  {object} data      Data to be passed to the mapper function
     */
    DoxyDocParser.prototype.callMapperFunc = function(mapperKey, thisValue, data) {
        mapperKey = mapperKey.replace(/^\./, '');
        var fn = this.__mapperFuncs[mapperKey];
        fn.call(thisValue, data);
    };

    DoxyDocParser.prototype.readFiles = function(files) {
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

    DoxyDocParser.prototype.parse = function(type, files, locals) {
        var result = this.readFiles(files);

        if (type === 'json') {
            return JSON.stringify(result, null, '    ');
        }

        var tmpl = fs.readFileSync(this.templateFile);

        if (result.customJS && typeof result.customJS === 'string') {
            result.customJS = [result.customJS];
        }

        if (result.customCSS && typeof result.customCSS === 'string') {
            result.customCSS = [result.customCSS];
        }
        return FireTPL.fire2html(tmpl, extend(result, locals), {
            partialsPath: path.join(this.templateDir, 'partials')
        });
    };

    DoxyDocParser.prototype.parseString = function(type, filename, string, locals) {
        var result = this.mapDoxResult([{
            file: filename,
            data: dox.parseComments(string)
        }]);

        if (type === 'json') {
            return JSON.stringify(result, null, '    ');
        }
        else if (type === 'raw') {
            return result;
        }

        var tmpl = fs.readFileSync(this.templateFile);
        return FireTPL.fire2html(tmpl, extend(result, locals), {
            partialsPath: path.join(this.templateDir, 'partials')
        });
    };

    /**
     * Parse a single file and returns the result
     * @param  {String} file filepath
     * @return {Object}      Returns a dox result
     */
    DoxyDocParser.prototype.parseFile = function(file) {
        var filepath = path.join(process.cwd(), file);
        var doxed = {
            file: file,
            data: dox.parseComments(fs.readFileSync(filepath, { encoding: 'utf8' }))
        };
        
        return doxed;
    };

    DoxyDocParser.prototype.mapDoxResult = function(doxed) {
        // fs.writeFile('dev-doxblock.json', JSON.stringify(doxed, true, '    '));

        var result = this.getMetaInfos();
        this.listing = [];
        doxed.forEach(function(doxFile) {
            var moduleName = doxFile.file;
            doxFile.ext = path.extname(doxFile.file);
            this.moduleDataType = doxFile.ext.substr(1);

            var data = doxFile.data.map(function(doxBlock) {
                var block = {};
                
                if (doxBlock.ignore) {
                    return;
                }

                // fs.appendFileSync('dev-doxblock.json', 'Doxed block: ' + JSON.stringify(doxBlock, true, '    ') + '\n\n');

                block = this.parseTags(doxBlock);

                if (block.ignore) {
                    return;
                }

                block.description = doxBlock.description;
                block.line = doxBlock.line;
                block.codeStart = doxBlock.codeStart;
                if (doxBlock.code) {
                    block.source = {
                        code: doxBlock.code ? doxBlock.code.split(/\/\/--/, 1)[0].trim() : null,
                        type: this.moduleDataType
                    };   
                }

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
                // if (doxFile.ext === '.js') {
                //     if (doxBlock.ctx.type === 'method') {
                //         block.method = block.method || doxBlock.ctx.name;
                //     }
                // }

                // fs.appendFileSync('dev-doxblock.json', 'Mapped to: ' + JSON.stringify(block, true, '    ') + '\n\n');
                
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

        result.listing = this.listing.map(function(listing) {
            listing.link = listing.name.replace(/\W+/g, '');
            listing.groups.forEach(function(group) {
                group.link = listing.link + '/' + group.id;
                group.items.forEach(function(item) {
                    if (item.name) {
                        item.link = group.link + '/' + item.name.replace(/\W+/g, '');
                        item.title = item.title || item.name;
                    }
                });
            });

            return listing;
        });

        return result;
    };

    DoxyDocParser.prototype.getMetaInfos = function() {
        var files = [this.doxydocFile, 'package.json'],
            dir,
            meta = {},
            file;

        for (var i = 0, len = files.length; i < len; i++) {
            dir = process.cwd();
            while(dir !== '/') {
                file = path.join(dir, files[i]);
                if (fs.existsSync(file)) {
                    if (files[i] === this.doxydocFile) {
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

    DoxyDocParser.prototype.setGroup = function(groupName, onCreateGroup) {
        var group;

        for (var i = 0, len = this.listing.length; i < len; i++) {
            if (this.listing[i].name === groupName) {
                return this.listing[i];
            }
        }

        group = new DoxyDocGroup(groupName);
        this.listing.push(group);
        if (typeof(onCreateGroup) === 'function') {
            onCreateGroup.call(group);
        }

        return group;
    };

    DoxyDocParser.prototype.parseTags = function(doxed) {
        var newTag = {},
            match;

        var tags = doxed.tags;

        // console.log('Doxed: ', doxed);

        if (tags && Array.isArray(tags)) {
            tags.forEach(function(tag) {

                switch(tag.type) {
                    case 'module':
                    case 'mixin':
                    case 'selector':
                        newTag.type = tag.type;
                        newTag.name = tag.string;
                        break;
                    case 'method':
                    case 'function':
                        newTag.type = tag.type;
                        newTag.name = tag.string || doxed.ctx.name;
                        break;
                    case 'param':
                        if (!newTag.params) {
                            newTag.params = [];
                        }

                        newTag.params.push({
                            name: tag.name,
                            description: tag.description,
                            dataTypes: tag.types,
                            optional: tag.optional
                        });

                        break;
                    case 'var':
                        match = tag.string.trim().match(/^(?:\{(.*)\})?\s*(\S+)?\s*(.+)?$/);

                        if (match[1]) {
                            newTag.dataTypes = match[1].split('|').map(function(type) {
                                return type.toLowerCase();
                            });
                        }

                        if (match[2]) {
                            newTag.name = match[2];
                        }

                        if (match[3]) {
                            newTag.description = match[3];
                        }

                        newTag.type = tag.type;
                        break;
                    case 'return':
                    case 'returns':
                        newTag.returns = {
                            dataTypes: tag.types,
                            description: tag.description
                        };
                        break;
                    case 'group':
                        newTag.group = tag.string;
                        break;
                    case 'constructor':
                        newTag.isConstructor = true;
                        newTag.type = 'function';
                        newTag.name = doxed.ctx ? doxed.ctx.name : '';
                        break;
                    case 'property':
                        newTag.name = tag.name;
                        newTag.type = tag.type;
                        newTag.dataTypes = tag.types.map(function(type) {
                            return type.substr(0, 1).toUpperCase() + type.substr(1).toLowerCase();
                        });
                        break;
                    case 'example':
                        if (!newTag.examples) {
                            newTag.examples = [];
                        }
                        newTag.examples.push({
                            code: this.toHtml(tag.string.replace(/^\s*\{(\w+)\}\s*/, '')),
                            type: this.grepPattern(/\{(\w+)\}/, tag.string) || this.moduleDataType
                        });
                        break;
                    case 'fires':
                    case 'event':
                        var key = tag.type === 'event' ? 'events' : tag.type;
                        if (!newTag[key]) {
                            newTag[key] = [];
                        }

                        match = tag.string.match(/^\s*(\S+)\s+(.+)$/);
                        if (match) {
                            newTag[key].push({
                                name: match[1],
                                description: match[2]
                            });
                        }
                        break;
                    case 'deprecated':
                        newTag.deprecated = tag.string || true;
                        break;
                    case 'private':
                    case 'protected':
                    case 'unimplemented':
                        newTag[tag.type.substr(0, 1).toUpperCase() + tag.type.substr(1)] = true;
                        break;
                    case 'ignore':
                        newTag[tag.type] = true;
                        break;
                    case 'link':
                        if (!newTag.webLinks) {
                            newTag.webLinks = [];
                        }

                        match = tag.string.match(/^(.*?)?(?:\s|^)(\S+)$/);
                        if (match) {
                            newTag.webLinks.push({
                                name: String(match[1] || match[2]).trim(),
                                url: match[2],
                                target: /^http(s)?\:/.test(match[2]) ? '_blank' : ''
                            });
                        }
                        break;
                    case 'preview':
                        if (!newTag.preview) {
                            newTag.previews = [];
                        }

                        var previewTag = tag.string.match(/^\s*\{(\w+)\}\s*([^]+$)/);

                        newTag.previews.push({
                            code: previewTag[2],
                            type: previewTag[1] || 'html'
                        });
                        break;
                }
            }.bind(this));

            if (doxed.ctx && (doxed.ctx.type === 'function' || doxed.ctx.type === 'method') && !newTag.type) {
                newTag.type = doxed.ctx.type;
                newTag.name = doxed.ctx.name;
            }
        }

        return newTag;
    };

    DoxyDocParser.prototype.grepPattern = function(pattern, str, index) {
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
    DoxyDocParser.prototype.grepDataTypes = function(str) {
        if (typeof str !== 'string' || str === '') {
            return [];
        }

        return str.replace(/^\{|\}$/g, '').split('|');
    };

    DoxyDocParser.prototype.grepDescription = function(description) {
        return description.full;
    };

    DoxyDocParser.prototype.toHtml = function(str) {
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };

    /**
     * Resolve a path relative to the baseDir
     *
     * @param {String} path Path to be resolved
     * @return {String} Resolved path
     */
    DoxyDocParser.prototype.resolveToBase = function(path) {
        var resolved = path.split('/').map(function(part, index, arr) {
            if (index + 1 === arr.length) {
                return '';
            }

            return '..';
        }).join('/');

        return resolved;
    };

    return DoxyDocParser;
})();