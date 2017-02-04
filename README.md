Doxydoc source code documentation generator
===========================================

DoxyDoc is a source code documentation generator for Javascript, LESS and CSS.

<br><br><img src="https://doxydoc.com/img/screenshot.jpg">

Installation
------------

Requirements: node.js >= 0.10.0, See [nodejs.org for Install instructions](http://nodejs.org)

The following command installs it globally by using npm

```bash
npm install -g doxydoc
```

Usage
-----

Change into your project root and run DoxyDoc command: `doxydoc [options] file1 file2 file3`

The `doxydoc --help` command shows you all commandline options.
The flowing command creates a documentation under `<cwd>/docs/` and creates a documentation from all `.js` files located under `src/` and `lib/`.

```bash
doxydoc -o docu.html index.js src/**/*.js lib/*.js
```

Each source file should have a @module or @group tag. Otherwise its filename will be used as a module name.
DoxyDoc looks into a file for a @module tag and groups all comment blocks under this module name. The @group tag overrides the module name for the current comment block.

```js
/**
 * @module myModule
 */

/**
 * Simple function
 */
function foo() {

}

/**
 * Simple function
 */
function bar() {

}
```

This adds function foo and bar to `myModule`.
The next function is placed in the same file, but shouldn't be under `myModule`.

```js
/**
 * Other simple function
 * @group secondModule
 */
function blub() {

}
```

This creates a new group in the documentation view and adds this function under `secondModule`

Syntax
------

DoxyDoc supports lots of tags.
See our [syntax declaration](http://doxydoc.com/syntax.html) page for more infos.
