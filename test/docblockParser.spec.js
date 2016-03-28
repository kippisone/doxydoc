// 'use strict';

// var docblockParser = require('docblock-parser');
// var fl = require('node-fl');

// describe.skip('DocBlockParser', function() {    
//     describe('Test', function() {
//         beforeEach(function() {

//         });

//         afterEach(function() {

//         });

//         it('Should parse a docblock', function() {
//             var comment = fl.read(__dirname + '/src/banana.js');
//             var match;

//             var reg = /\/\*\*[^]+?\*\//g;

//             while(true) {
//                 match = reg.exec(comment);
                
//                 if (!match) {
//                     break;
//                 }

//                 // console.dir(match[0]);/

//                 var res = docblockParser.parse(match[0]);
//                 console.log(res);
//             }
//         });

//         it('Should define an own config', function() {
//             var consumers = require('docblock-parser/lib/consumers');

//             var multilineTilTag = consumers.multilineTilTag;
//             var multilineTilEmptyLineOrTag = consumers.multilineTilEmptyLineOrTag;
//             var booleanTag = consumers.booleanTag;
//             var singleParameterTag = consumers.singleParameterTag;

//             var paramConsumer = function(x, i) {
//                 console.log('PARAM', x, i);
//                 return multilineTilEmptyLineOrTag(x, i);
//             };
            
//             var config = {
//                 text: multilineTilTag,
//                 default: multilineTilTag,
//                 tags: {
//                     augments: singleParameterTag,
//                     author: multilineTilEmptyLineOrTag,
//                     borrows: multilineTilEmptyLineOrTag,
//                     class: multilineTilTag,
//                     constant: booleanTag,
//                     constructor: booleanTag,
//                     constructs: booleanTag,
//                     default: singleParameterTag,
//                     deprecated: multilineTilEmptyLineOrTag,
//                     desciption: multilineTilTag,
//                     event: booleanTag,
//                     example: multilineTilTag,
//                     extends: singleParameterTag,
//                     field: booleanTag,
//                     fileOverview: multilineTilTag,
//                     function: booleanTag,
//                     ignore: booleanTag,
//                     inner: booleanTag,
//                     lends: singleParameterTag,
//                     memberOf: singleParameterTag,
//                     name: booleanTag,
//                     namespace: booleanTag,
//                     param: paramConsumer,
//                     private: booleanTag,
//                     property: multilineTilEmptyLineOrTag,
//                     public: booleanTag,
//                     requires: multilineTilEmptyLineOrTag,
//                     returns: multilineTilEmptyLineOrTag,
//                     see: singleParameterTag,
//                     since: singleParameterTag,
//                     static: booleanTag,
//                     throws: multilineTilEmptyLineOrTag,
//                     type: singleParameterTag,
//                     version: multilineTilEmptyLineOrTag
//                 }
//             };

//             var comment = fl.read(__dirname + '/src/banana.js');
//             var match;

//             var reg = /\/\*\*[^]+?\*\//g;

//             while(true) {
//                 match = reg.exec(comment);
                
//                 if (!match) {
//                     break;
//                 }

//                 // console.dir(match[0]);

//                 var res = docblockParser(config).parse(match[0]);
//                 console.log(res);
//             }
//         }); 
//     });
// });
