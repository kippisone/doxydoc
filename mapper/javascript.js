module.exports = function(doxed) {
    'use strict';

    var extend = require('node.extend');

    var moduleName = this.file,
        groupName;

    var createLink = function() {
        var args = Array.prototype.slice.call(arguments);
        return args.map(function(item) {
            return item.replace(/\W+/g, '');
        }).join('/');
    };

    doxed.forEach(function(block) {
        if (!block) {
            return;
        }
        
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

        var labelize = function(arr) {
            if (arr) {
                return arr.map(function(item) {
                    var ucfName = item.substr(0, 1).toUpperCase() + item.substr(1);
                    return '<span class="label label' + ucfName + '">' + item + '</span>';
                });
            }
        };

        if (block.params) {
            block.params.forEach(function(item) {
                item.dataTypes = labelize(item.dataTypes);
            });
        }

        if (block.returns) {
            block.returns.dataTypes = labelize(block.returns.dataTypes);
        }



        if (block.events) {
            block.events.forEach(function(ev) {
                var description = {
                    full: ev.description,
                    summary: ev.description.split('\n\n')[0],
                    body: ev.description.split('\n\n').slice(1).join('\n\n')
                };

                group.addItem('events', extend({}, ev, {
                    registrar: {
                        type: block.type,
                        name: block.name,
                        link: createLink(groupName, block.type, block.name)
                    },
                    description: description
                }));
            });
        }

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