/*
  A browser implementation of next tick (faster than setTimeout)
*/

if ( global.setImmediate ){
  module.exports = function ( fn ) {
    return global.setImmediate( fn );
  };
}
else if ( global.postMessage ){
  var queue = [];
  global.addEventListener('message', function( ev ){
    if ( ev.data === 'next' ){
      ev.stopPropagation();
      while ( queue.length > 0 ){
        queue.shift()();
      }
    }
  }, true);

  module.exports = function ( fn ){
    queue.push( fn );
    global.postMessage('next', '*');
  };
}

