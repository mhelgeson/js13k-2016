/*
  Local Storage for tracking progress
*/

var prefix = 'awry:';

exports.set = function( key, value ){
  global.localStorage.setItem( prefix + key, value );
};

exports.get = function( key ){
  return global.localStorage.getItem( prefix + key );
};
