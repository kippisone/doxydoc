module.exports = function(doxed) {
    'use strict';

    var moduleName = this.file,
        groupName;

    doxed.forEach(function(block) {
        groupName = moduleName;

         if (block.type === 'module') {
            moduleName = block.name;
            groupName = block.name;
         }
         else if (block.group) {
            groupName = block.group;
         }

        var group = this.setGroup(groupName, function() {
            this.defineGroup('items', {
                name: ''
            });

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

        if (block.type === 'module') {
            return;
        }

        //Add labels
        var labels = [
            [block.isConstructor, 'Constructor'],
            [block.isProtected, 'Protected'],
            [block.isPrivate, 'Private'],
            [block.isUnimplemented, 'Unimplemented'],
            [
                block.deprecated, 
                typeof block.deprecated === 'string' ? 'Deprecated since ' + block.deprecated : 'Deprecated'
            ]
        ];

        block.labels = [];
        labels.forEach(function(test) {
            if (test[0]) {
                block.labels.push(test[1]);
            }
        });

        if (block.type === 'method' && block.name) {
            block.title = block.name + '()';
            group.addItem(block.type, block);
        }
        else if ((block.type === 'property') && block.name) {
            group.addItem(block.type, block);
        }
        else if ((block.type === 'function' || block.type === 'var') && block.name) {
            group.addItem('items', block);
        }
        else {
            group.addUnknown(block);
        }


    }.bind(this));
};