/**
 *  @private
 */

var def = require('../def');
var key = 'cache#' + Date.now().toString(36);

/**
 *  @public
 */
module.exports = function cache ( ref, prop, val ){
  if ( ref[ key ] == null ){
    Object.defineProperty( ref, key, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: Object.create( null )
    });
  }
  return def.call( ref[ key ], prop || '', val );
};
