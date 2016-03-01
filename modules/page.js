'use strict';

var path = require('path');
var fl = require('node-fl');
var FireTPL = require('firetpl');
var marked = require('marked');
var highlightjs = require('highlight.js');

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

    setContent(content) {
        this.content = content;
    }

    render() {
        console.log('RENDER PAGE', this.template);
        let tmpl = fl.read(this.template);
        let tmplType = path.extname(this.template);
        let html;

        let content;
        if (this.content) {
            console.log('RENDER CONT', this.data);
            let contType = path.extname(this.content);
            let cont = fl.read(this.content);

            if (contType === '.fire') {
                content = this.parseFireTPL(cont, path.dirname(this.content));
            }
            else if (contType === '.md') {
                content = this.parseMarkdown(cont, path.dirname(this.content));
            }
            else if (contType === '.html') {
                content = this.parseHTML(cont, path.dirname(this.content));
            }

            this.data.content = content;
        }

        if (tmplType === '.fire') {
            html = this.parseFireTPL(tmpl, path.dirname(this.template));
        }
        else if (tmplType === '.md') {
            html = this.parseMarkdown(tmpl, path.dirname(this.template));
        }
        else if (tmplType === '.html') {
            html = this.parseHTML(tmpl, path.dirname(this.template));
        }

        return html;
    }

    parseFireTPL(source, includesPath) {
        return FireTPL.fire2html(source, this.data, {
            includesPath: includesPath
        });
    }

    parseMarkdown(source) {
        var mdRenderer = new marked.Renderer();
        
        mdRenderer.code = function(code, language) {
            // var indention = /^\t|\s{2,4}/.exec(code);
            // if (false && indention) {
            //     code = code.split('\n').map(function(line) {
            //         return line.replace(indention[0], '');
            //     }).join('\n');
            // }

            code = code.replace(/\&#96;/g, '`');

            code = highlightjs.highlightAuto(code).value;
            return '<div class="codeBox"><code class="codeBlock hljs lang-' + language + '">' + code + '</code></div>';
        };

        // mdRenderer.html = function(html) {
        //     console.log('HTML', html);
        // };

        mdRenderer.table = function(header, body) {
            return '<table class="dcMultiTable">' + header + body + '</table>';
        };

        mdRenderer.tablerow = function(row) {
            if (/^<th>/.test(row)) {
                return '<thead><tr>' + row + '</tr></thead>';            
            }
            else {
                return '<tbody><tr>' + row + '</tr></tbody>';
            }
        };

        marked.setOptions({
            renderer: mdRenderer,
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        });

        return marked(source);
    }

    parseHTML(html) {
        return html;
    }
}

module.exports = Page;
