'use strict';

var fl = require('node-fl');
var path = require('path');
var Docblock = require('docblock');

class Docs {
    constructor() {
        this.items = [];
        this._cache = {};
    }

    readFiles() {
        for (var i = 0, len = this.files.length; i < len; i++) {
            let file = this.files[i];          
            let name = path.basename(file);
            let type = path.extname(file).substr(1);
            this.files[i] = {
                name: name,
                source: fl.read(file),
                type: type
            };
        }
    }

    parse(files) {
        this.files = files;
        this.readFiles();
        this.files.map(function(file) {
            let docblock = new Docblock();
            let result = docblock.parse(file.source, file.type);
            this.setFileInfo(file);
            this.parseDoc(result);
        }, this);

        return this.items;
    }

    setFileInfo(file) {
        this.curFilepath = file;
        this.curFilename = path.basename(file);
    }

    getCachedItem(keys) {
        var key = keys.join('-');
        return this._cache[key];
    }

    setCacheItem(keys, obj) {
        var key = keys.join('-');
        return this._cache[key] = obj;
    }

    parseDoc(docs) {
        docs.forEach(function(doc, index) {
            if (doc.package) {
                this.createPackage(doc);
            }
            
            if (doc.subpackage) {
                this.createSubpackage(doc);
            }
            
            if (doc.module) {
                this.createModule(doc);
            }
            
            if (doc.submodule) {
                this.createSubmodule(doc);
            }

            if (!this.bucket) {
                this.bucket = this.items;
                this.createModule({
                    module: this.curFilename
                });
            }
            
            if (doc.group) {
                this.createGroupItem(doc.group, doc);
            }
            else {
                this.createUngroupedItem(doc.group, doc);
            }
        }, this);
    }

    createPackage(doc) {
        this.curPackage = this.getCachedItem([doc.package]) || {
            file: this.curFile,
            name: doc.package,
            type: 'package',
            items: []
        };

        this.bucket.push(this.curPackage);
        this.bucket = this.curPackage.items;
        this.setCacheItem([doc.package], this.curPackage);
    }

    createSubpackage(doc) {
        this.curSubpackage = this.getCachedItem([this.curPackage, doc.subpackage]) || {
            name: doc.subpackage,
            type: 'subpackage',
            items: []
        };

        this.bucket.push(this.curSubpackage);
        this.bucket = this.curSubpackage.items
        this.setCacheItem([this.curPackage, doc.subpackage], this.curSubpackage);
    }

    createModule(doc) {
        this.curModule = this.getCachedItem([this.curPackage, this.curSubpackage], doc.module) || {
            name: doc.module,
            type: 'module',
            items: []
        };
        
        this.bucket.push(this.curModule);
        this.bucket = this.curModule.items;
        this.setCacheItem([this.curPackage, this.curSubpackage, doc.module], this.curModule);
    }

    createSubmodule(doc) {
        this.curSubmodule = this.getCachedItem([this.curPackage, this.curSubpackage, this.curModule, doc.submodule]) || {
            name: doc.submodule,
            type: 'submodule',
            items: []
        };
        
        this.bucket.push(this.curSubmodule);
        this.bucket = this.curSubmodule.items;
        this.setCacheItem([this.curPackage, this.curSubpackage, this.curModule, doc.subpackage], this.curSubpackage);
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
}

module.exports = Docs;
