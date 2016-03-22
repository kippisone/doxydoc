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
        // console.log('RENDER PAGE', this.template);
        let tmpl = fl.read(this.template);
        let tmplType = path.extname(this.template);
        let html;

        let content;
        if (this.content) {
            // console.log('RENDER CONT', this.data);
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

        if (this.data.docs && this.data.docs.pageLinks) {
            this.createPageLinks(content);
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
            return '<div class="code-box"><code class="code-block hljs lang-' + language + '">' + code + '</code></div>';
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

    /**
     * Scans a html string and return an array of all <h*> tags with an id attribute
     * @param  {String} html Input string
     * @return {Array}      Array of found anchor links
     */
    createPageLinks(html) {
        var reg = /<(h[1-6])[^>]+\bid\=["'](.*?)["'].*?>(.+?)<\/(a|h[1-6])>/g,
            links = [],
            tags = [];

        var tagPath = [],
            tagArr = {'h1': 1, 'h2': 2, 'h3': 3, 'h4': 4, 'h5': 5, 'h6': 6};

        let loop = true;
        while(loop) {
            var match = reg.exec(html);
            if (!match) {
                break;
            }

            tagPath = tagPath.concat();

            var tagPos = tagPath.indexOf(match[1]);
            if (tagPos === -1) {
                if (tagPath[0] && tagArr[tagPath[0]] > tagArr[match[1]]) {
                    tagPath = [match[1]];
                }
                else {
                    tagPath.push(match[1]);
                }
            }
            else {
                tagPath = tagPath.slice(0, tagPos + 1);
            }

            tags.push({
                link: match[2],
                tag: match[1],
                path: tagPath,
                text: this.stripHtml(match[3])
            });
        }

        var traverse = function(data, inTraversal) {
            var result = [];

            let loop = true;
            while(loop) {
                var item = data.shift();
                if (!item) {
                    break;
                }

                result.push({
                    link: '#' + item.link,
                    text: item.text
                });

                if (data[0] && data[0].path.length > item.path.length) {
                    var itemProp = result[result.length - 1];
                    if (data.length) {
                        itemProp.items = traverse(data, true);
                    }
                }

                if (inTraversal && data[0] && data[0].path.length < item.path.length) {
                    break;
                }
            }

            return result;
        };

        links = traverse(tags);

        if (this.data.sidebar) {
            for (var i = 0, len = this.data.sidebar.length; i < len; i++) {
                if (this.data.sidebar[i].link === this.data.docs.link) {
                    this.data.sidebar[i].subNavigation = links;
                }
            }
        }
    }

    /**
     * Strip any html tags from a string
     * @param  {String} str Input string
     * @return {String}     Stripped string
     */
    stripHtml(str) {
        return str.replace(/<\/?[a-zA-Z0-9]+.*?>/g, '');
    }
}

module.exports = Page;
