var time = require('../time');

var reqAnimFrame = global.requestAnimationFrame ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame ||
  global.oRequestAnimationFrame ||
  setTimeout;

var canAnimFrame = global.cancelAnimationFrame ||
  global.webkitCancelAnimationFrame ||
  global.mozCancelAnimationFrame ||
  global.oCancelAnimationFrame ||
  clearTimeout;

exports.next = function( callback, scope ){
  return reqAnimFrame(function( t ){
    callback.call( scope || this, time() );
  }, 16 );
};

exports.cancel = function( id ){
  return canAnimFrame( id );
};
