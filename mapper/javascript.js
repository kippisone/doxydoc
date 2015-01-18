module.exports = function(doxed) {
    'use strict';

    var groupName, moduleName;

    doxed.data.forEach(function(block) {
        block.tagsArray.forEach(function(tag) {
            switch (tag.type) {
                case 'module':
                    moduleName = tag.string;
                    break;
                case 'group':
                    groupName = tag.string;
                    break;
            }
        });
    });
    
    if (!groupName && !moduleName) {
        return;
    }
    
    var group = this.addListing(groupName || moduleName || doxed.file);

    group.defineGroup('property', {
        name: 'Properties'
    });

    group.defineGroup('method', {
        name: 'Methods'
    });

    group.defineGroup('events', {
        name: 'Events'
    });

    doxed.data.forEach(function(block) {
        if (block.ctx && block.ignore === false) {
            switch (block.ctx.type) {
                case 'property':
                    if (!block.isConstructor) {
                        group.addItem('property', {
                            name: block.ctx.name,
                            cons: block.ctx.cons,
                            code: block.code,
                            description: block.description
                        });
                    }

                    break;
                case 'method':
                    group.addItem('method', {
                        name: block.ctx.name,
                        cons: block.ctx.cons,
                        code: block.code,
                        description: block.description
                    });
                    break;
            }
        }
    }.bind(this));

};