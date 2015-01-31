/**
 * @module DoxyDocGroup
 */
module.exports = (function() {
    'use strict';

    /**
     * DoxyDocGroup
     *
     * @constructor
     */
    var DoxyDocGroup = function(name) {
        this.name = name;
        this.groups = [];
    };

    DoxyDocGroup.prototype.addItem = function(type, data) {
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

    DoxyDocGroup.prototype.addUnknown = function(data) {
        if (!this.unknown) {
            this.unknown = [];
        }

        this.unknown.push(data);
    };

    DoxyDocGroup.prototype.defineGroup = function(type, content) {
        content.id = type;
        content.items = [];
        this.groups.push(content);
    };

    DoxyDocGroup.prototype.getItems = function() {
        console.log('GEEEET', this.items);
        return this.items[0];
    };


    DoxyDocGroup.prototype.toJSON = function() {
        return {
            name: this.name,
            groups: this.groups,
            unknown: this.unknown,
            link: this.link
        };
    };

    return DoxyDocGroup;
})();