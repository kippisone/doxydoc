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

    doxed.data.forEach(function(block) {
        console.log(block);
        if (block.ignore === false) {
            // switch (block.type) {
                // case 'property':
                    if (!block.isConstructor) {
                        group.addItem('property', {
                            name: block.name,
                            code: block.code,
                            example: block.example,
                            description: block.description
                        });
                    }

                    // break;
            // 
        }
    }.bind(this));

};