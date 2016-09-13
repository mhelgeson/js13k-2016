// core module
var path = require('path');

// the directory of the main module
var main_dir = path.dirname( require.main.filename );

// pattern to match any file extensions
var ext_regex = /(\/index)?(\.\w+)*$/g;

module.exports = {

  // {object} key/value map where window['key'] = require('value'), in output
  exports: {},

  // {string} the output file...
  output: process.stdout,//path.resolve('./dist/index.js'),

  // {string} wrap the entire output in iife, passing in the root scope
  prefix: '(function( global ){\n\n',
  suffix: '\n})( this );\n',

  // {string} browser shim for define/require
  define: path.resolve('./tasks/defreq/define/index.js'),

  // {string} the template for writing module defines
  module: path.resolve('./tasks/defreq/module/index.js'),

  // {string} the template slug to replace the module id
  module_id: '"/* module_id */"',

  // {string} the template slug to replace the module body
  module_body: '/* module_body */',

  // {function} alias any filename as a shorter/unique module name
  alias: function ( fullpath ){
    // take relative path from main, trim the extension...
    return path.relative( main_dir, fullpath ).replace( ext_regex, "" );
  }

};
