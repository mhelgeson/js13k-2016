module.exports = function def ( namespace, value ){
  if ( typeof namespace !== 'string' ){
    throw new TypeError('def `namespace` must be a string.');
  }
  var node = this, last, keys = namespace.split('.');
  if ( typeof value === 'undefined' ){
    keys.every(function( key ){
      return ( node = node[ key ] ) ? true : false;
    });
    return node;
  }
  else {
    last = keys.pop();
    keys.forEach(function( key ){
      node = ( node[ key ] = node[ key ] || Object.create( null ) );
    });
    return ( node[ last ] = value );
  }
};
