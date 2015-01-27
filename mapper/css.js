var extend = require('node.extend');

module.exports = function(doxed) {
    'use strict';

    var moduleName = this.file,
        groupName,
        self = this;

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

            this.defineGroup('vars', {
                name: 'Variables'
            });

            this.defineGroup('mixins', {
                name: 'Mixins'
            });
        });

        if (block.type === 'module') {
            return;
        }

        //Add labels
        var labels = [
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

        var colorPreview = function(code) {
            var color = self.grepPattern(/((#[a-fA-F0-9]{3,6})|(rgb(a)?\([^\)]+))/, code);
            return '<div class="cssColorPreview" style="background-color: ' + color + '">' +
                    color +
                '</div>';
        };

        if (block.type === 'mixin') {
            block.name = block.name || this.grepPattern(/\.(\w+)\([^\)]*\)/, block.code);
            group.addItem('mixins', block);
        }
        else if (block.type === 'var') {
            block.name = block.name || this.grepPattern(/\.(\w+)\([^\)]*\)/, block.code);
            // block.dataTypes = this.grepDataTypes(block.var);
            block.preview = block.preview || colorPreview(block.code);
            group.addItem('vars', block);
        }
        else if ((block.type === 'function' || block.type === 'var') && block.name) {
            group.addItem('items', block);
        }
        else {
            group.addUnknown(block);
        }


    }.bind(this));
};
