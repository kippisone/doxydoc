Doxydoc documentation generator
===============================

Installation
------------

Requirements: node.js >= 10.0

```shell
    npm install -g doxydoc
```

Usage
-----

Change into your project root and run DoxyDoc command: `doxydoc [options] file1 file2 file3`

The `doxydoc --help` command shows your all options
The flowing command creates a documentation under `<cwd>/docs/` and creates a documentation from all files located under `src/ and lib/` and ends with `.js`

```shell
    doxydoc -o docu.html index.js src/**/*.js lib/*.js
```

Each source file should have a @module or @group tag. Otherwise its filename will be used as a module name.
DoxyDoc looks into a file for a @module tag and adds all comment blocks under this module name. The @group tag overrides the module name for the current comment block.

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

This adds the function foo and var into the topic `myModule`.
The next function is placed in the sam file, but shoudn't be under `myModule`.

```js
/**
 * Other simple function
 * @group secondModule
 */
function blub() {
    
}
```

This creates a new topic in the documentation view and adds this function under `secondModule`

[[See syntax declaration][http://doxydoc.com/syntax.html]] for mor infos.