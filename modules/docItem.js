'use strict';


/**
 * Doc item object
 *
 * @class DocItem
 */
class DocItem {
    constructor(parent, atype) {
        this.atype = atype || 'root';
        this.items = [];
        this.data = {};

        if (parent) {
            this.parent = parent;
            parent.items.push(this);
        }
    }

    set(data) {
        Object.assign(this.data, data);
    }

    addPackage(data) {
        var p = this.getByName('package', data.package);
        p.set(data);
        return p;
    }

    addSubpackage(data) {
        var p = this.getByName('subpackage', data.subpackage);
        p.set(data);
        return p;
    }

    addModule(data) {
        var m = this.getByName('module', data.module);
        m.set(data);
        return m;
    }

    addSubmodule(data) {
        var m = this.getByName('submodule', data.submodule);
        m.set(data);
        return m;
    }

    addGroup(data) {
        var g = this.getByName('group', data.group);
        g.set(data);
        return g;
    }


    addContent(data) {
        var parent = this.getParentBucket('content');
        var c = new ContentItem(parent);
        c.set(data);
        return c;
    }

    getParentBucket(aname) {
        var parents = ['root', 'package', 'submodule',
        'module', 'submodule', 'group', 'content'];

        var parent = this;
        var nameIndex = parents.indexOf(aname);
        
        while (parent) {
            if (nameIndex > parents.indexOf(parent.atype)) {
                return parent;
            }

            if (!parent.parent) {
                return parent;
            }

            parent = parent.parent;
        }
        
        return parent;
    }

    getInstance(atype, parent) {
        let obj = {};

        switch(atype) {
            case 'package':
                obj = new PackageItem(parent || this);
                break;
            case 'subpackage':
                obj = new SubPackageItem(parent || this);
                break;
            case 'module':
                obj = new ModuleItem(parent || this);
                break;
            case 'submodule':
                obj = new SubModuleItem(parent || this);
                break;
            case 'group':
                obj = new GroupItem(parent || this);
                break;
            case 'content':
                obj = new ContentItem(parent || this);
                break;
            default:
                obj = null;
        }

        return obj;
    }

    getByName(atype, aname) {
        var parent = this.getParentBucket(atype);
        for (let child of parent.items || []) {
            if (child.aname === aname) {
                return child;
            }
        }

        let obj = this.getInstance(atype, parent);
        obj.aname = aname;
        return obj;
    }

    toJSON() {
        
    }

    toObject() {
        var obj = Object.assign({
            atype: this.atype,
            aname: this.aname || '',
            data: this.data
        });

        if (this.items) {
            obj.items = this.items.map(function(item) {
                return item.toObject();
            });
        }

        return obj;
    }
}


/**
 * Represents a package item
 * @class PackageItem
 */
class PackageItem extends DocItem {
    constructor(parent, atype) {
        super(parent, atype || 'package');
    }
}


/**
 * Represents a package item
 * @class SubPackageItem
 */
class SubPackageItem extends PackageItem {
    constructor(parent, atype) {
        super(parent, atype || 'subpackage');
    }

    addPackage(data) {
        var p = this.getByName('package', data.package);
        p.set(data);
        return p;
    }
}


/**
 * Represents a module item
 */
class ModuleItem extends SubPackageItem {
    constructor(parent, atype) {
        super(parent, atype || 'module');
    }

    addSubpackage(data) {
        var p = this.getByName('subpackage', data.subpackage);
        p.set(data);
        return p;
    }
}


/**
 * Represents a submodule item
 */
class SubModuleItem extends ModuleItem {
    constructor(parent, atype) {
        super(parent, atype || 'submodule');
    }

    addModule(data) {
        var p = this.getByName('module', data.module);
        p.set(data);
        return p;
    }
}


/**
 * Represents a group item
 * @class GroupItem
 */
class GroupItem extends SubModuleItem {
    constructor(parent, atype) {
        super(parent, atype || 'group');
    }

    addSubmodule(data) {
        var p = this.getByName('submodule', data.submodule);
        p.set(data);
        return p;
    }
}


/**
 * Represents a content item
 * @class GroupItem
 */
class ContentItem extends GroupItem {
    constructor(parent, atype) {
        super(parent, atype || 'content');
        delete this.items;
    }

    addGroup(data) {
        var g = this.getByName('group', data.group);
        g.set(data);
        return g;
    }
}


module.exports = DocItem