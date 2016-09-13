/**
 * Customizes native `require` to trace the dependency graph of supplied args
 *
 * @exports {function} tracer function
 * @params {string} one or more paths to require/trace dependencies
 * @returns {object} lists of module definitions and requires
 *
 *    {
 *      "requires": [
 *        "/resolved/filename/from/trace/argument.js",
 *      ],
 *      "defines": [{
 *        "filename": "/resolved/filename/of/each/module.js",
 *        "requires": [{
 *          "path": "./module/require/path",
 *          "filename": "/resolved/module/require/path.js"
 *        }]
 *      ]
 *    }
 *
 */
var debug = require('debug')('defreq:trace');

module.exports = function( path ){

  var requires = [], defines = [], lookup = {}, dependencies = 0;

  // ref the original module.require
  var _require = module.__proto__.require;

  // redefine `module.require` to collect dependencies...
  module.__proto__.require = function( path ){
    // a file required by any module, resolves relative to each module
    var filename = this.constructor._resolveFilename( path, this );
    // required by the main module
    if ( this === require.main ){
      debug('req: '+ filename );
      // add it to the requires list
      requires.push( filename );
    }
    // required by a required module
    else {
      debug('dep: ('+ JSON.stringify( path ) +') '+ filename );
      // add a new dependency
      lookup[ this.id ].requires.push({
        // the require path used inside the module
        path: path,
        // the resolved filename of the require path
        filename: filename
      });
      dependencies += 1;
    }
    // never seen this file before
    if ( !lookup[ filename ] ){
      debug('def: '+ filename );
      // intiialize the graph file object
      lookup[ filename ] = { filename:filename, requires:[] };
      // add it to the definition list
      defines.push( lookup[ filename ] );
    }
    // call original require
    return _require.apply( this, arguments );
  }

  // shim some globals
  global.window = {};

  // require all arguments...
  Array.prototype.forEach.call( arguments, function( path ){
    // assume any include paths are relative to the main module
    require.main.require( path );
  });

  // restore original `require`
  module.__proto__.require = _require;

  return { requires:requires, defines:defines };
}
