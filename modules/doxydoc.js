'use strict';

var path = require('path');

var Docs = require('./docs');
var Page = require('./page');
var fl = require('node-fl');
var co = require('co');
var log = require('logtopus');
var copyDir = require('copy-dir');

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

        if (conf.verbose) {
            log.setLevel('debug');
        }

        this.workingDir = path.resolve(process.cwd(), conf.workingDir || process.cwd());
        this.doxydocFile = path.resolve(this.workingDir, conf.doxydocFile || 'doxydoc.json');
        this.templateDir = path.resolve(this.workingDir, conf.templateDir || path.join(__dirname, '../templates/new-lagoon/'));

        log.debug('Working dir:', this.workingDir);
        log.debug('Doxydoc file:', this.doxydocFile);
        log.debug('Template dir:', this.templateDir);
    }

    /**
     * Run doxydoc
     * @return {object} Returns a promise
     */
    create() {
        return co(function *() {
            this.conf = yield this.readDoxydocFile();
            this.docs = this.conf.docs;
            yield this.createDocs();
            console.log('DD', this.docs);
            yield this.createDocPages();
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
                styles: []
            }, conf);

            [ conf, conf.navigation, conf.sidebar, conf.docs].forEach(function(prop) {
                [ 'styles', 'scripts' , 'files'].forEach(function(key) {
                    if (prop[key] && typeof prop[key] === 'string') {
                        prop[key] = [prop[key]];
                    }
                });
            });

            conf.docs = conf.docs.map(function(doc) {
                if (doc.files && typeof doc.files === 'string') {
                    doc.files = [doc.files];
                }

                return doc;
            });

            resolve(conf);
        }.bind(this));
    }

    scanDir(dir, match) {
        return new Promise(function(resolve, reject) {
            fl.scanDir(dir, match, function(err, files) {
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
                        files = files.concat(fileScan.map(function(file) {
                            return file.name
                        }));
                    }

                    log.debug('Parse docs files:', files);
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
                        log.debug('Write html output', filename);

                        var page = new Page();
                        page.setData(data);
                        page.setTemplate(path.join(this.templateDir, 'docs.fire'));

                        page.render(filename);
                    }
                    else if (ext === '.json') {
                        log.debug('Write json output', filename);
                        fl.write(filename, JSON.stringify(data, null, '  '));
                    }
                }, this);
                
            }
        }.bind(this));
    }

    copyStaticFiles() {
        return co(function *() {
            log.debug('Coppy static files');
            fl.copy(path.join(this.templateDir, 'main.css'), path.join(this.workingDir, 'doxydoc.css'));
            copyDir.sync(path.join(this.templateDir, 'img'), path.join(this.workingDir, 'img'));
        }.bind(this));
    }

    getGenericConf() {
        return {
            navigation: this.navigation,
            sidebar: this.sidebar,
            styles: this.styles,
            scripts: this.scripts
        }
    }

    mergeMetaData(docs) {
        return Object.assign(this.conf, {
            docs: docs
        });
    }
}

module.exports = Doxydoc;
