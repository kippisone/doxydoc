'use strict';

var fl = require('node-fl');
var path = require('path');
var Docblock = require('docblock');

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
            console.log('P', doc.tags.package);
            if (doc.tags.package) {
                this.createPackage(doc.tags.package);
            }
            
            // if (doc.tags.subpackage) {
            //     this.createSubpackage(doc.tags.subpackage);
            // }
            
            // if (doc.tags.module) {
            //     this.createModule(doc.tags.module);
            // }
            
            // if (doc.tags.submodule) {
            //     this.createSubmodule(doc.tags.submodule);
            // }

            // if (!this.bucket) {
            //     this.bucket = this.items;
            //     this.createModule({
            //         module: this.curFilename
            //     });
            // }
            
            // if (doc.group) {
            //     this.createGroupItem(doc.group, doc);
            // }
            // else {
            //     this.createUngroupedItem(doc.group, doc);
            // }
        }, this);
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
}

module.exports = Docs;
