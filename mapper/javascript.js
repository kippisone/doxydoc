module.exports = function(doxed) {
    'use strict';

    var moduleName = this.file,
        groupName;

    doxed.forEach(function(block) {
        groupName = moduleName;

         if (block.tags.module) {
            moduleName = block.tags.module;
            groupName = block.tags.module;
         }
         else if (block.tags.group) {
            groupName = block.tags.group;
         }

        var group = this.setGroup(groupName, function() {
            this.defineGroup('property', {
                name: 'Properties'
            });

            this.defineGroup('method', {
                name: 'Methods'
            });

            this.defineGroup('events', {
                name: 'Events'
            });
        });

        if (block.tags.module) {
            return;
        }

        if (block.tags.property) {
            group.addItem('property', block);
        }
        else if (block.tags.method) {
            group.addItem('method', block);
        }
        else if (block.tags.event) {
            group.addItem('event', block);
        }
        else {
            group.addUnknown(block);
        }


    }.bind(this));
};