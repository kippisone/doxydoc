'use strict';

var hljs = require('highlight.js'),
    $ = require('jquery');

require('dresscode-less');

$(function() {
    var els = document.getElementsByClassName('codeBlock');
    for (var i = 0, len = els.length; i < len; i++) {
        hljs.highlightBlock(els[i]);
    }

    //Make navigation sticky
    var headerHeight = $('.pageHeader').outerHeight(),
        subNaviLeft = $('.pageBody').offset().left,
        isSticky = false;

    $(document).scroll(function(e) {
        if (!isSticky && document.body.scrollTop > headerHeight) {
            $('.stickyItem').addClass('sticky');
            $('.pageLeft').css('left', subNaviLeft);
            isSticky = true;
        }
        else if (isSticky && document.body.scrollTop < headerHeight) {
            $('.stickyItem').removeClass('sticky');
            $('.pageLeft').css('left', '');
            isSticky = false;
        }
    });

    $(window).resize(function() {
        subNaviLeft = $('.pageBody').offset().left;
    });
});

