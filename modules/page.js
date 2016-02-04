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
        this.data.docs = data;
    }

    setTemplate(template) {
        this.template = template;
    }

    render(file) {
        console.log('READ', this.template);
        var tmpl = fl.read(this.template);
        var html = FireTPL.fire2html(tmpl, this.data, {
            includesPath: path.dirname(this.template)
        });

        fl.write(file, html);
    }
}

module.exports = Page;
