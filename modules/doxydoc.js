'use strict';

var path = require('path');
var glob = require('glob');

var Docs = require('./docs');
var Page = require('./page');
var fl = require('node-fl');
var co = require('co');
var log = require('logtopus');
var copyDir = require('copy-dir');

var Superjoin = require('superjoin');
var stylus = require('stylus');

/**
 * Creates a Doxydoc pages
 *
 * @package Doxydoc
 * @module Doxydoc
 *
 * @class Doxydoc
 *
 * @example
 * var doxydoc = new Doxydoc();
 */
class Doxydoc {
    constructor(conf) {
        conf = conf || {};

        if (conf.debug) {
            log.setLevel('debug');
        }

        this.workingDir = path.resolve(process.cwd(), conf.workingDir || process.cwd());
        this.doxydocFile = path.resolve(this.workingDir, conf.doxydocFile || 'doxydoc.json');

        this.initConf = conf;
    }

    /**
     * Run doxydoc
     * @return {object} Returns a promise
     */
    create() {
        return co(function *() {
            this.conf = yield this.readDoxydocFile();
            this.setConfiguration(this.conf);
            this.docs = this.conf.docs;
            this.pages = this.conf.pages.concat(this.conf.sidebar, this.conf.navigation).filter(page => {
                return !!page.file;
            });

            yield this.createDocs();
            yield this.createDocPages();
            yield this.resolveData();
            yield this.createPages();
            yield this.copyStaticFiles();
            return this.docs;
        }.bind(this));
    }

    /**
     * Read configuration from doxydoc.json file
     * @return {object} Returns config as a JSON object
     */
    readDoxydocFile() {
        return new Promise(function(resolve, reject) {
            var conf = {};
            if (fl.exists(this.doxydocFile)) {
                conf = fl.read(this.doxydocFile);
                try {
                    conf = JSON.parse(conf);
                }
                catch (err) {
                    reject('Reading doxydoc file failed!\n' + err.message);
                }
            }

            conf = Object.assign({
                docs: [],
                pages: [],
                navigation: [],
                sidebar: [],
                scripts: [],
                styles: [],
                indexPage: './'
            }, conf);

            this.livereload = this.initConf.livereload || conf.livereload;
            this.livereload = this.livereload === true ? 13987 : this.livereload;

            [ conf, conf.docs].forEach(function(prop) {
                [ 'styles', 'scripts' , 'files'].forEach(function(key) {
                    if (prop[key] && typeof prop[key] === 'string') {
                        prop[key] = [prop[key]];
                    }

                    if (!prop[key]) {
                        prop[key] = [];
                    }

                    if (this.livereload && key === 'scripts') {
                        prop[key].push('//localhost:' + this.livereload + '/livereload.js');
                    }
                }, this);
            }, this);

            conf.docs = conf.docs.map(function(doc) {
                if (doc.files && typeof doc.files === 'string') {
                    doc.files = [doc.files];
                }

                return doc;
            });

            resolve(conf);
        }.bind(this));
    }

    setConfiguration(conf) {
        this.outputDir = path.resolve(this.workingDir, this.initConf.outputDir || conf.outputDir || this.workingDir);

        this.templateDir = this.initConf.templateDir || conf.templateDir || 'lagoon';
        if (['lagoon', 'deep-space'].indexOf(this.templateDir) !== -1) {
            this.templateDir = path.resolve(__dirname, '../templates', this.templateDir);
        }
        else {
            this.templateDir =  path.resolve(this.workingDir, this.templateDir);
        }


        log.debug('Working dir:', this.workingDir);
        log.debug('Output dir:', this.outputDir);
        log.debug('Doxydoc file:', this.doxydocFile);
        log.debug('Template dir:', this.templateDir);
        log.debug('Livereload:', this.livereload);
    }

    scanDir(dir, match) {
        return new Promise(function(resolve, reject) {
            let opts = {
                cwd: dir,
                nodir: true
            };

            glob(match, opts, function(err, files) {
                if (err) {
                    return reject(err);
                }

                resolve(files);
            });
        }.bind(this));
    }

    /**
     * Create docs pages
     * @return {object} Returns a promise
     */
    createDocs() {
        return co(function *() {
            for (let docs of this.docs) {
                if (docs.data) {
                    let customData = require(path.resolve(this.workingDir, docs.data));
                    log.debug('Load custom data:', customData);
                    docs.docs = customData;
                }
                else {
                    let newDocs = new Docs();

                    var files = [];
                    for (let file of docs.files) {
                        if (file.indexOf('*') === -1) {
                            files.push(file);
                            continue;
                        }

                        var fileScan = yield this.scanDir(this.workingDir, file);
                        files = files.concat(fileScan.map(file => {
                            return path.join(this.workingDir, file);
                        }));
                    }

                    log.debug('Parse docs files:', files);
                    files = files.map(f => {
                        return path.resolve(this.workingDir, f);
                    }, this);
                    docs.docs = newDocs.parse(files);
                }
            }
        }.bind(this));
    }

    createDocPages() {
        return co(function *() {
            for (let docs of this.docs) {
                if (typeof docs.output === 'string') {
                    docs.output = [docs.output];
                }

                docs.output.forEach(function(filename) {
                    var ext = path.extname(filename);
                    var data = this.mergeMetaData(docs.docs);

                    if (ext === '.html') {
                        var page = new Page();
                        page.setData(data);
                        page.setTemplate(path.join(this.templateDir, 'docs.fire'));

                        let html = page.render(filename);
                        filename = path.resolve(this.outputDir, filename);
                        log.debug('Write html output', filename);
                        fl.write(filename, html);
                    }
                    else if (ext === '.json') {
                        log.debug('Write json output', filename);
                        filename = path.resolve(this.outputDir, filename);
                        fl.write(filename, JSON.stringify(data, null, '  '));
                    }
                }, this);

            }
        }.bind(this));
    }

    createPages() {
        return co(function *() {
            for (let pageItem of this.pages) {
                let cont = path.resolve(this.workingDir, pageItem.file);
                let tmpl = path.resolve(this.templateDir, 'page.fire');
                let data = this.mergeMetaData(pageItem);

                let page = new Page();
                page.setData(data);
                page.setTemplate(tmpl);
                page.setContent(cont);

                if (!pageItem.link) {
                    throw new Error(`Missing link property in ${pageItem.name}`);
                }

                let html = page.render();


                let outfile = path.resolve(this.outputDir, pageItem.link);
                log.debug('Write page', pageItem.name, 'to', outfile);
                fl.write(outfile, html);
            }
        }.bind(this));
    }

    copyStaticFiles() {
        return co(function *() {
            log.debug('Coppy static files to', this.outputDir);
            yield this.createJSBundle();
            yield this.createCSSBundle();
            copyDir.sync(path.join(this.templateDir, 'img'), path.join(this.outputDir, 'img'));
        }.bind(this));
    }

    getGenericConf() {
        return {
            navigation: this.navigation,
            sidebar: this.sidebar,
            styles: this.styles,
            scripts: this.scripts
        };
    }

    mergeMetaData(docs) {
        return Object.assign(this.conf, {
            docs: docs
        });
    }

    /**
     * Creates a JS bundle, using superjoin
     */
    createJSBundle() {
        var superjoin = new Superjoin({
            // verbose: this.verbose,
            root: this.templateDir,
            workingDir: this.templateDir,
            npmDir: path.join(__dirname, '../node_modules'),
            outfile: path.join(this.outputDir, 'doxydoc.js')
        });

        return superjoin.build();
    }

    createCSSBundle() {
        return co(function *() {
            let stl = fl.read(path.join(this.templateDir, 'stylus/main.styl'));
            stl = stylus(stl)
            .set('filename', path.join(this.outputDir, 'main.css'))
            .include(path.join(this.templateDir, 'stylus'))
            .include(path.join(__dirname, '../node_modules/lyssl'))

            let css = yield new Promise(function(resolve, reject) {
                stl.render(function(err, css) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(css);
                });
            });

            fl.write(path.join(this.outputDir, 'doxydoc.css'), css);
        }.bind(this));
    }

    resolveData() {
        //console.log('RESOLVE', this.conf);
        for (let key of ['pages', 'navigation', 'sidebar']) {
            let prop = this.conf[key];

            for (let item of prop) {
                item.target = item.target || '_self';
                item.title = item.title || item.name;
            }
        }

        return Promise.resolve();
    }
}

module.exports = Doxydoc;
