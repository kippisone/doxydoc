/**
 * Banana test module
 *
 * Very awesome banana module.
 * 
 * @module  banana
 * @example
 *     var banana = require('banana');
 *     banana.peelIt();
 */
module.exports = function() {
    'use strict';
    
    /**
     * Test constant
     * @const {string}
     */
    var NAME = 'banana';

    /**
     * Banana constructor
     * @constructor
     */
    var Banana = function() {

    };

    /**
     * Tastes method of Banana
     * 
     * @return {string} Returns how bananas tastes
     */
    Banana.prototype.tastes = function() {
        return 'awesome';
    };

    /**
     * Private method
     *
     * @private
     * @param {boolen} isGreen Returns true if banana is green
     */
    Banana.prototype.isGreen = function(green) {
        
    };

    /**
     * Is sweet property
     *
     * @property {boolean} isSweet
     */
    Banana.prototype.isSweet = false;

    /**
     * Protected method
     *
     * @protected
     */
    Banana.prototype.isProtected = function() {

    };

    /**
     * Private method
     *
     * @private
     */
    Banana.prototype.isPrivate = function() {

    };

    /**
     * Deprecated method
     *
     * @deprecated
     */
    Banana.prototype.isDeprecated = function() {

    };

    /**
     * Deprecated since method
     *
     * @deprecated v0.3.0
     */
    Banana.prototype.isDeprecated = function() {

    };

    /**
     * Unimplemented method
     * @unimplemented
     */
    Banana.prototype.isUnimplemented = function() {

    };
};