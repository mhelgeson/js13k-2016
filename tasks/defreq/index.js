
// core modules
var util = require('util');
var path = require('path');

// debug logging
var debug = require('debug')('defreq:main');

// module for collecting all dependencies
var trace = require('./trace');

// module for outputting the generated file
var write = require('./write');

// module for storing the default options
var defaults = require('./defaults');

// TODO: callback is not quite completely implemented
module.exports = function defreq ( options, callback ){

  // fill in missing options with default values
  Object.keys( defaults ).forEach(function( key ){
    if ( !options[ key ] ){
      options[ key ] = defaults[ key ];
      debug('default: '+ key );
    }
    else {
      debug('options: '+ key );
    }
  });

  // extract the export names (options.exports keys)
  var exports = Object.keys( options.exports );
  debug('exports.length = ' + exports.length );

  // input validation
  if ( !exports.length ){
    throw new Error('No valid keys in `exports` option.');
  }

  // isolate the require paths (options.exports values)
  var requires = [];
  exports.forEach(function( name ){
    requires.push( options.exports[ name ] );
  });
  debug('requires.length = ' + requires.length );

  // input validation
  if ( !requires.length ){
    throw new Error('No valid values in `exports` option.');
  }

  // get dependencies for all "main" export modules
  return write( options, trace.apply( this, requires ), callback );
};
