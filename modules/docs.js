'use strict';

var fl = require('node-fl');
var path = require('path');
var Docblock = require('docblock');

class Docs {
    constructor() {
        this.items = [];
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
            this.parseDoc(result);
        });

        return this.items;
    }

    parseDoc(docs) {
        docs.forEach(function(doc) {
            if (doc.package) {
                this.createPackage(doc);
            }
            else if (doc.subpackage) {
                this.createSubpackage(doc);
            }
            else if (doc.module) {
                this.createModule(doc);
            }
            else if (doc.submodule) {
                this.createSubmodule(doc);
            }
            else if (doc.group) {
                this.createGroupItem(doc.group, doc);
            }
            else {
                this.createUngroupedItem(doc.group, doc);
            }
        });
    }

    createPackage(doc) {
        this.curPackage = {
            name: doc.package,
            type: 'package',
            items: []
        };

        this.curSubpackage = this.curPackage;
        this.curModule = this.curPackage;
        this.curSubmodule = this.curPackage;
        this.items.push(this.curPackage);
    }

    createSubpackage(doc) {
        this.curSubpackage = {
            name: doc.subpackage,
            type: 'subpackage',
            items: []
        };
        
        this.curModule = this.curSubpackage;
        this.curSubmodule = this.curSubpackage;
        this.curPackage.items.push(this.curSubpackage);
    }

    createModule(doc) {
        this.curModule = {
            name: doc.module,
            type: 'module',
            items: []
        };
        
        this.curSubmodule = this.curModule;
        this.curSubpackage.items.push(this.curModule);
    }

    createSubmodule(doc) {
        this.curSubmodule = {
            name: doc.submodule,
            type: 'submodule',
            items: []
        };
        
        this.curModule.items.push(this.curSubmodule);
    }

    getGroupItem(items, group) {
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i].group === group) {
                return items[i];
            }
        }

        var newGroup = {
            type: group === 'ungrouped' ? 'ungrouped' : 'grouped',
            group: group,
            items: []
        };

        items.push(newGroup);

        return newGroup;
    }

    createGroupItem(group, doc) {
        var groupItem = this.getGroupItem(this.curSubmodule.items, group);
        groupItem.items.push(doc);
    }

    createUngroupItem(group, doc) {
        var groupItem = this.getGroupItem(this.curSubmodule.items, 'ungrouped');
        groupItem.items.push(doc);
    }
}

module.exports = Docs;
