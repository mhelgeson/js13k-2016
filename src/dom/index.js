var Class = require('../Class');

var select = require('./select');
var create = require('./create');
var patternHTML = /^<.+>$/;
var patternNewLine = /\n/g;


module.exports = Class('Dom').extend({
  construct: function( arg, opt ){
    // create elements from markup
    if ( patternHTML.test( arg.replace( patternNewLine, "" ) ) ){
      return create( arg );
    }
    // select elements from document
    else {
      return select( arg, opt );
    }
  },
});
