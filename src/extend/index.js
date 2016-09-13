var forEach = Array.prototype.forEach;

module.exports = function extend (){
  return forEach.call( arguments, function( obj ){
    Object.keys( obj || {} ).forEach(function( key ){
      this[ key ] = obj[ key ];
    }, this );
  }, this ) || this;
};
