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

        this.workingDir = conf.workingDir || process.cwd();
        this.doxydocFile = path.resolve(this.workingDir, conf.doxydocFile || 'doxydoc.json');
        this.templateDir = conf.templateDir || path.join(__dirname, '../templates/new-lagoon/');
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

            resolve(conf);
        }.bind(this));
    }

    /**
     * Run doxydoc
     * @return {object} Returns a promise
     */
    create() {
        return co(function *() {
            let conf = yield this.readDoxydocFile();
            Object.assign(this, conf);
            yield this.createDocs();
            yield this.createDocPages();
            return this.docs;
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
        }.bind(this));
    }

    createDocPages() {
        return co(function *() {
            for (let docs of this.docs) {
                var page = new Page();
                page.setData(docs.docs);
                console.log('TMPL', this.templateDir);
                page.setTemplate(path.join(this.templateDir, 'docs.fire'));
                
                var output = path.resolve(this.workingDir, docs.output);
                log.debug('Write docs file:', output);
                page.render(output);
            }
        }.bind(this));
    }
}

module.exports = Doxydoc;
