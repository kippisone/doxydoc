var fs = require('fs'),
    path = require('path');

var glob = require('glob'),
    dox = require('dox'),
    FireTPL = require('firetpl'),
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

    };

    Doxit.prototype.readFiles = function(files, callback) {
        var options = {
            nodir: true
        };

        glob(files, options, function(err, files) {
            files = files.filter(function(file) {
                return !/node_modules/.test(file);
            });
            
            console.log(files);
            var res = files.map(this.parseFile.bind(this));
            this.mapDoxResult(res, callback);
        }.bind(this));
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

    Doxit.prototype.mapDoxResult = function(doxed, callback) {
        fs.writeFile('dev.json', JSON.stringify(doxed, true, '    '));

        var result = this.getMetaInfos();
        this.listing = [];
        doxed.forEach(function(item) {

            item.data = item.data.map(function(curItem) {
                curItem.tagsArray = curItem.tags || [];
                curItem.tags = this.parseTags(curItem.tags);
                return curItem;
            }.bind(this));

            var res = {
                file: item.file,
                addListing: this.addListing.bind(this)
            };

            var mapper;

            fs.writeFile('dev2.json', JSON.stringify(item, true, '    '));
            switch (path.extname(item.file)) {
                case '.js':
                    mapper = require('./mapper/javascript.js');
            }

            if (mapper) {
                mapper.call(res, item);
            }

            return res;
        }.bind(this));

        result.listing = this.listing;

        console.log(result.listing);
        console.log(JSON.stringify(result, null, '  '));
        var tmpl = fs.readFileSync(path.join(__dirname, 'templates/default.fire'));
        fs.writeFile('doxit.html', FireTPL.fire2html(tmpl, result));
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

    Doxit.prototype.addListing = function(groupName) {
        var group;

        for (var i = 0, len = this.listing.length; i < len; i++) {
            if (this.listing[i].name === groupName) {
                return this.listing[i];
            }
        }

        group = new DoxitGroup(groupName);
        this.listing.push(group);
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
                    else {
                        newTag[tag.type] = tag.string === '' ? true : tag.string;
                    }
                }
            });
        }

        return newTag;
    };

    return Doxit;
})();