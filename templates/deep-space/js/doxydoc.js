/* eslint-env browser */
'use strict';

var hljs = require('highlight.js'),
    $ = require('jquery');

$(function() {
    var els = document.getElementsByClassName('code-block');
    for (var i = 0, len = els.length; i < len; i++) {
        hljs.highlightBlock(els[i]);
    }

    //Make navigation sticky
    var headerHeight = $('.dd-header').outerHeight(),
        isSticky = false;

    $(document).scroll(function(e) {
        if (!isSticky && document.body.scrollTop > headerHeight) {
            $(document.body).addClass('sticky');
            isSticky = true;
        }
        else if (isSticky && document.body.scrollTop < headerHeight) {
            $(document.body).removeClass('sticky');
            isSticky = false;
        }
    });
});
