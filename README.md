Doxydoc documentation generator
-----------------------------

Installation
============

```shell
    npm install -g doxydoc
```

Usage
=====

```shell
    doxydoc -o docu.html index.js src/**/*.js lib/*.js
```

Files should have a @module or @group tag. Otherwise its filename will be used as module name.

Syntax
======

 Tag                       | Description                         
---------------------------|-------------------------------------
**@module** [name]         | Sets module name for whole document. A second `@module` tag overrides the module name and all following doc blocks will be passed to this module.
**@group** [name]          | Overrides the module name for the current block and passes the doc block to this module. It creates a new module if it isn't existing yet.
**@constructor**           | Indicates a function as a class constructor
**@method** [name]         | Sets a method name
**@property** {type} [name]| Sets a property name. {type} describes the data types that the property could be.
**@example**
<code>                     | Defines a example block

