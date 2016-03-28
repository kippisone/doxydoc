var hljs = require('highlight.js');

require('dresscode-less');

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    var els = document.getElementsByClassName('code-block');
    for (var i = 0, len = els.length; i < len; i++) {
        hljs.highlightBlock(els[i]);
    }
});
