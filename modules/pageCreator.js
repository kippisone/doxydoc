'use strict';

var fs = require('fs'),
    path = require('path');

var Superjoin = require('superjoin'),
    Markdown = require('markdown-it'),
    extend = require('node.extend'),
    grunt = require('grunt');

var DoxyDocParser = require('./doxydocParser'),
    firetpl = require('firetpl');

var PageCreator = function(conf) {
    this.conf = {
        indexPage: 'README.md',
        templateDir: conf.templateDir || path.join(__dirname, '../templates/lagoon/'),
        output: conf.output || 'docs',
        docuFilename: conf.docuFilename || 'docu.html'
    };

    var templateDirs = require('../doxydoc').templateDirs;
    if (templateDirs[this.conf.templateDir]) {
        this.conf.templateDir = templateDirs[this.conf.templateDir];
    }

    this.rootDir = process.cwd();
    this.outDir = path.resolve(process.cwd(), this.conf.output);
    this.locals = this.getMetaInfos();
    this.locals.basePath = (this.locals.basePath || '').replace(/^\//, '');
};

PageCreator.prototype.log = function() {
    if (this.verbose) {
        var args = Array.prototype.slice.call(arguments);
        grunt.log.ok.apply(grunt.log, args);
    }
};

PageCreator.prototype.createPages = function() {
    this.prepareData();

    if (fs.existsSync(path.join(process.cwd(), 'doxydoc.json'))) {
        extend(this.conf, require(path.join(process.cwd(), 'doxydoc.json')));
    }

    if (this.locals.customJS && typeof this.locals.customJS === 'string') {
        this.locals.customJS = [this.locals.customJS];
    }

    if (this.locals.customCSS && typeof this.locals.customCSS === 'string') {
        this.locals.customCSS = [this.locals.customCSS];
    }

    //Create index page
    if (this.conf.indexPage) {
        this.createPage(this.conf.indexPage, 'index.html', 'index.fire');
    }

    //Parse navigation links
    this.conf.navigationLinks.forEach(function(link) {
        if (link.file) {
            this.createPage(link.file, link.link, 'page.fire', link);
        }
    }, this);


    //Create documentation
    var docu = this.createDocu('html', this.files),
        docuPath = path.join(this.outDir, this.conf.docuFilename);
    
    var outDir = this.outDir;

    //Create js bundle
    var superjoin = new Superjoin();

    superjoin.verbose = this.verbose;
    superjoin.root = this.conf.templateDir;
    var sjConf = superjoin.getConf();
    var out = superjoin.join(sjConf.files, sjConf.main);
    grunt.file.write(path.join(outDir, 'doxydoc.js'), out);

    var copyAssets = function(abspath, rootdir, subdir, file) {
        var src, dest;

        if (arguments.length === 2) {
            src = abspath;
            dest = rootdir;
        }
        else {
            if (!subdir || !/^js|lib\//.test(subdir)) {
                return;
            }

            src = abspath;
            dest = path.join(outDir, subdir, file);
        }

        grunt.log.ok(' ... copy', src.replace(path.join(__dirname, '..') + '/', ''));
        grunt.file.copy(src, dest);
    };

    this.log('Create docu page:', this.conf.docuFilename);
    this.log('Copy docu to:', this.outDir);
    grunt.file.write(docuPath, docu);
    copyAssets(path.join(this.conf.templateDir, 'main.css'), path.join(outDir, 'main.css'));
    copyAssets(path.join(__dirname, '../node_modules/highlight.js/styles/', 'dark.css'), path.join(outDir, 'highlight.css'));
    this.log('Finish!');
};

PageCreator.prototype.createPage = function(src, name, template, data) {
    data = data || {};
    
    var ext = path.extname(src);
    if (this.verbose) {
        this.log('Create page "%s" from source: %s', name, src);
    }
    
    template = template || 'page.fire';

    var source;
    if (ext === '.md') {
        source = this.parseMarkdown(fs.readFileSync(src, { encoding: 'utf8' }));
    }
    else if (ext === '.fire') {
        source = this.parseFireTPL(fs.readFileSync(src, { encoding: 'utf8' }));
    }
    else {
        source = fs.readFileSync(src, { encoding: 'utf8' });
    }
    
    var ftl = grunt.file.read(path.join(this.conf.templateDir, template));
    var html = firetpl.fire2html(ftl, extend({
            content: source,
            title: data.name || this.locals.name
        }, data, this.locals), {
        partialsPath: path.join(this.conf.templateDir, 'partials')
    });
    grunt.file.write(path.join(this.outDir, name), html);
};

PageCreator.prototype.parseMarkdown = function(source) {
    var md = new Markdown({
        html:         true,        // Enable HTML tags in source 
        breaks:       true,        // Convert '\n' in paragraphs into <br> 
        langPrefix:   'codeBlock ',  // CSS language prefix for fenced blocks. Can be 
                                  // useful for external highlighters. 
        linkify:      true        // Autoconvert URL-like text to links 
    });
    return md.render(source);
};

PageCreator.prototype.parseFireTPL = function(source) {
    return firetpl.fire2html(source, this.locals, {
        partialsPath: path.join(this.conf.templateDir, 'partials')
    });
};

PageCreator.prototype.createDocu = function(type, files) {
    
    var doxydoc = new DoxyDocParser();
    doxydoc.templateFile = path.join(this.conf.templateDir, 'docu.fire');
    doxydoc.templateDir = this.conf.templateDir;
    return doxydoc.parse(type, files);
};

PageCreator.prototype.getMetaInfos = function() {
    var files = ['doxydoc.json', 'package.json'],
        dir,
        meta = {},
        file;

    for (var i = 0, len = files.length; i < len; i++) {
        dir = process.cwd();
        while(dir !== '/') {
            file = path.join(dir, files[i]);
            if (fs.existsSync(file)) {
                if (files[i] === 'doxydoc.json') {
                    meta = require(file);
                }
                else {
                    var pkg = require(file);
                    meta.name = meta.name || pkg.name;
                    meta.version = meta.version || pkg.version;
                    meta.description = meta.description || pkg.description;
                }
            }

            dir = path.join(dir, '..');
        }
    }

    return meta;
};

PageCreator.prototype.prepareData = function() {
    this.locals.navigationLinks.forEach(function(link) {
        if (link.link && !/^(http(s)?:|\/)/.test(link.link)) {
            // console.log('Change path', link.link, this.locals.basePath);
            link.link = path.join(this.locals.basePath, '/', link.link);
            // console.log(' ... to', link.link);
        }

        if (!link.target) {
            link.target = '_self';
        }
    }, this);

    this.locals.headerLinks.forEach(function(link) {
        if (link.link && !/^(http(s)?:|\/)/.test(link.link)) {
            // console.log('Change path', link.link, this.locals.basePath);
            link.link = path.join(this.locals.basePath, '/', link.link);
            // console.log(' ... to', link.link);
        }

        if (!link.target) {
            link.target = '_self';
        }
    }, this);
};

module.exports = PageCreator;
