'use strict';

var fl = require('node-fl');
var path = require('path');
var Docblock = require('docblock');
var DocItem = require('./docItem');

class Docs {
    constructor() {
        this.items = [];
        this._cache = {};
        this.bucket = this.items;
    }

    readFiles() {
        for (var i = 0, len = this.files.length; i < len; i++) {
            let file = this.files[i];          
            let name = path.basename(file);
            let type = path.extname(file).substr(1);
            this.files[i] = {
                name: name,
                file: file,
                source: fl.read(file),
                type: type
            };
        }
    }

    parse(files) {
        this.files = files;
        this.readFiles();
        var docs = this.parseDoc(this.files);

        return docs;
    }

    setFileInfo(file) {
        this.curFilepath = file.name;
        this.curFilename = path.basename(file.name);
        this.curFileType = path.extname(file.name).substr(1);
    }

    getCachedItem(keys) {
        var key = keys.join('-');
        return this._cache[key];
    }

    setCacheItem(keys, obj) {
        var key = keys.join('-');
        return this._cache[key] = obj;
    }

    parseDoc(files) {
        var docParser = new DocItem();
        var docItem = docParser;

        files.forEach(function(file) {
            let docblock = new Docblock();
            let blocks = docblock.parse(file.source, file.type);
            fl.write('blocks.json', JSON.stringify(blocks, null, '  '));
            this.setFileInfo(file);
            
            blocks.forEach(function(doc, index) {
                this.createFileParam(file, doc);

                if (doc.code) {
                    this.createSource(doc);
                    delete doc.code;
                }
                
                if (doc.tags['package']) {
                    docItem = docItem.addPackage(doc);
                }
                
                if (doc.tags.subpackage) {
                    docItem = docItem.addSubpackage(doc);
                }
                
                if (doc.tags.module) {
                    docItem = docItem.addModule(doc);
                }
                
                if (doc.tags.submodule) {
                    docItem = docItem.addSubmodule(doc);
                }

                if (doc.group) {
                    docItem = docItem.addGroup(doc);
                    docItem = docItem.addContent(doc);
                }
                else {
                    doc.group = 'ungrouped';
                    docItem = docItem.addGroup(doc);
                    docItem = docItem.addContent(doc);
                }
            }, this);

        }, this);

        return docParser.toObject();
    }


    createPackage(packageName) {
        this.curPackage = this.getCachedItem([packageName]) || {
            file: this.curFilepath,
            name: packageName,
            type: 'package',
            items: []
        };

        this.bucket.push(this.curPackage);
        this.bucket = this.curPackage.items;
        this.setCacheItem([packageName], this.curPackage);
    }

    createSubpackage(subpackageName) {
        this.curSubpackage = this.getCachedItem([this.curPackage, subpackageName]) || {
            file: this.curFilepath,
            name: subpackageName,
            type: 'subpackage',
            items: []
        };

        this.bucket.push(this.curSubpackage);
        this.bucket = this.curSubpackage.items
        this.setCacheItem([this.curPackage, subpackageName], this.curSubpackage);
    }

    createModule(moduleName) {
        this.curModule = this.getCachedItem([this.curPackage, this.curSubpackage], moduleName) || {
            file: this.curFilepath,
            name: moduleName,
            type: 'module',
            items: []
        };
        
        this.bucket.push(this.curModule);
        this.bucket = this.curModule.items;
        this.setCacheItem([this.curPackage, this.curSubpackage, moduleName], this.curModule);
    }

    createSubmodule(submoduleName) {
        this.curSubmodule = this.getCachedItem([this.curPackage, this.curSubpackage, this.curModule, submoduleName]) || {
            file: this.curFilepath,
            name: submoduleName,
            type: 'submodule',
            items: []
        };
        
        this.bucket.push(this.curSubmodule);
        this.bucket = this.curSubmodule.items;
        this.setCacheItem([this.curPackage, this.curSubpackage, this.curModule, submoduleName], this.curSubpackage);
    }

    getGroupItem(items, group) {
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i].group === group) {
                return items[i];
            }
        }

        var newGroup = this.getCachedItem([this.curPackage, this.curSubpackage, this.curModule, this.curSubmodule, group]) || {
            type: group === 'ungrouped' ? 'ungrouped' : 'grouped',
            group: group,
            items: []
        };

        items.push(newGroup);

        this.setCacheItem([this.curPackage, this.curSubpackage, this.curModule, this.curSubmodule, group], newGroup);

        return newGroup;
    }

    createGroupItem(group, doc) {
        var groupItem = this.getGroupItem(this.bucket, group);
        groupItem.items.push(doc);
    }

    createUngroupedItem(group, doc) {
        var groupItem = this.getGroupItem(this.bucket, 'ungrouped');
        groupItem.items.push(doc);
    }

    createFileParam(file, doc) {
        doc.file = {
            file: file.file,
            name: file.name,
            type: file.type
        };
    }

    createSource(doc) {
        doc.source = {
            type: doc.file.type,
            code: doc.code
        }
    }
}

module.exports = Docs;
