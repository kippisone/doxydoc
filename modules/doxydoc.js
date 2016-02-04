'use strict';

var path = require('path');

var Docs = require('./docs');
var Page = require('./page');
var fl = require('node-fl');
var co = require('co');
var log = require('logtopus');

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

            [ conf, conf.navigation, conf.sidebar ].forEach(function(prop) {
                [ 'styles', 'scripts' ].forEach(function(key) {
                    if (prop[key] && typeof prop[key] === 'string') {
                        prop[key] = [prop[key]];
                    }
                });
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
                    docs.docs = customData;
                }
                else {
                    let newDocs = new Docs();
                    // console.log('N', newDocs);

                    var files = [];
                    for (let file of docs.files) {
                        if (file.indexOf('*') === -1) {
                            files.push(file);
                            return;
                        }

                        var fileScan = yield this.scanDir(this.workingDir, file);
                        files = files.concat(fileScan.map(function(file) {
                            return file.name
                        }));
                    }

                    docs.docs = newDocs.parse(files);
                }
            }
        }.bind(this));
    }

    createDocPages() {
        return co(function *() {
            for (let docs of this.docs) {
                var output = this.getOutputNames(docs.output);
                if (typeof docs.output === 'string') {
                    docs.output = [docs.output];
                }
                
                if (output.html) {
                    log.debug('Write html output', output.html);

                    var page = new Page();
                    page.setData(docs.docs);
                    page.setTemplate(path.join(this.templateDir, 'docs.fire'));

                    log.debug('Write docs file:', output.html);
                    page.render(output.html);
                }
                
                if (output.json) {
                    log.debug('Write json output', output.json);
                    console.log(docs.docs);
                    fl.write(output.json, JSON.stringify(docs.docs, null, '  '));
                }
            }
        }.bind(this));
    }

    copyStaticFiles() {
        return co(function *() {
            log.debug('Coppy static files');
            fl.copy(path.join(this.templateDir, 'main.css'), path.join(this.workingDir, 'doxydoc.css'));
        }.bind(this));
    }

    getOutputNames(output) {
        var outputNames = {};
        output.forEach(function(name) {
            var ext = path.extname(name).substr(1);
            outputNames[ext] = path.resolve(this.workingDir, name);
        }, this);

        return outputNames;
    }

    getGenericConf() {
        return {
            navigation: this.navigation,
            sidebar: this.sidebar,
            styles: this.styles,
            scripts: this.scripts
        }
    }
}

module.exports = Doxydoc;
