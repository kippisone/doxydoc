'use strict';

var path = require('path');
var fl = require('node-fl');
var FireTPL = require('firetpl');

fl.debug = true;

class Page {
    constructor(conf) {
        this.data = {
            basePath: ''
        };
    }

    setData(data) {
        Object.assign(this.data, data);
    }

    setTemplate(template) {
        this.template = template;
    }

    render(file) {
        var tmpl = fl.read(this.template);
        var html = FireTPL.fire2html(tmpl, this.data, {
            includesPath: path.dirname(this.template)
        });

        return html;
    }
}

module.exports = Page;
