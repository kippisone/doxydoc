/*global hljs */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    var els = document.getElementsByClassName('code');
    for (var i = 0, len = els.length; i < len; i++) {
        hljs.highlightBlock(els[i]);
    }
});