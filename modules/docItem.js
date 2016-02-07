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
        var p = new PackageItem(this);
        p.set(data);
        return p;
    }

    addSubpackage(data) {
        var p = new SubPackageItem(this);
        p.set(data);
        return p;
    }

    addModule(data) {
        var m = new ModuleItem(this);
        m.set(data);
        return m;
    }

    addSubmodule(data) {
        var m = new SubModuleItem(this);
        m.set(data);
        return m;
    }

    addGroup(data) {
        var g = this.getByName('group', data.group) || new GroupItem(this);
        g.set(data);
        return g;
    }

    addContent(data) {
        var parent = this.getParentBucket('content');
        var c = new ContentItem(parent);
        c.set(data);
        return c;
    }

    getParentBucket(name) {
        var parents = ['root', 'package', 'submodule',
        'module', 'submodule', 'group', 'content'];

        var parent = this.parent;
        var nameIndex = parents.indexOf(name);
        
        while (parent.parent) {
            if (nameIndex > parents.indexOf(parent.atype)) {
                return parent;
            }

            parent = parent.parent;
        }
        
        return parent;
    }

    getByName(atype, name) {
        var bucket = this.getParentBucket(name);
        for (let child of bucket.items || []) {
            if (child.name === name) {
                return child;
            }
        }

        return null;
    }

    toJSON() {
        
    }

    toObject() {
        var obj = this.data;
        obj.atype = this.atype;

        if (this.items) {
            obj.items = this.items.map(function(item) {
                return item.toObject();
            });
        }

        // for (let key of Object.keys(this)) {
        //     if (key === 'items') {
        //         for (let item of this.items) {
        //             obj[key].push(item.toObject());
        //         }
        //     }
        //     else if (key !== 'parent') {
        //         obj[key] = this[key];
        //     }
        // }

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
        var parent = this.getParentBucket('package');
        var p = new PackageItem(parent);
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
        var parent = this.getParentBucket('subpackage');
        var p = new SubPackageItem(parent);
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
        var parent = this.getParentBucket('module');
        var p = new ModuleItem(parent);
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
        var parent = this.getParentBucket('submodule');
        var p = new SubModuleItem(parent);
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
        var parent = this.getParentBucket('group');
        var g = this.getByName('group', data.group) || new GroupItem(parent);
        g.set(data);
        return g;
    }
}


module.exports = DocItem