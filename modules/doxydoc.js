'use strict';

var path = require('path');

var Docs = require('./docs');
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
                docs.docs = newDocs.parse(docs.files);
            }
        }.bind(this));
    }
}

module.exports = Doxydoc;
