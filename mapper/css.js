var extend = require('node.extend');

module.exports = function(doxed) {
    'use strict';

    var groupName, moduleName,
        self = this;

    var colorPreview = function(code) {
        var color = self.grepPattern(/((#[a-fA-F0-9]{3,6})|(rgb(a)?\([^\)]+))/, code);
        return '<div class="cssColorPreview" style="background-color: ' + color + '">' +
                color +
            '</div>';
    };

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

    group.defineGroup('vars', {
        name: 'Variables'
    });

    group.defineGroup('mixins', {
        name: 'Mixins'
    });

    doxed.data.forEach(function(block) {
        if (block.ignore === false) {
            var doc = {};

            doc.examples = block.examples;
            doc.description = block.description;
            doc.code = block.code;

            if (block.tags.mixin) {
                group.addItem('mixins', extend(doc, {
                    name: block.tags.name || this.grepPattern(/\.(\w+)\([^\)]*\)/, block.code),
                    type: 'method'
                }));
            }

            else if (block.tags.var) {
                group.addItem('vars', extend(doc, {
                    name: block.tags.name || this.grepPattern(/(@\w+):/, block.code),
                    dataTypes: this.grepDataTypes(block.tags.var),
                    preview: colorPreview(block.code)
                }));
            }
        }
    }.bind(this));
};