module.exports = (function() {
    'use strict';

    /**
     * Doxit group
     */
    var DoxitGroup = function(name) {
        this.name = name;
        this.groups = [];
    };

    DoxitGroup.prototype.addItem = function(type, data) {
        var group;

        for (var i = 0, len = this.groups.length; i < len; i++) {
            if (this.groups[i].id === type) {
                group = this.groups[i];
            }
        }

        if (!group) {
            group = {
                id: type,
                items: []
            };

            this.groups.push(group);
        }


        group.items.push(data);
    };

    DoxitGroup.prototype.defineGroup = function(type, content) {
        content.id = type;
        content.items = [];
        this.groups.push(content);
    };

    DoxitGroup.prototype.getItems = function() {
        console.log('GEEEET', this.items);
        return this.items[0];
    };

    DoxitGroup.prototype.toJSON = function() {
        return {
            name: this.name,
            groups: this.groups
        };
    };

    return DoxitGroup;
})();