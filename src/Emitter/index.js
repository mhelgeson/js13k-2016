var Class = require('../Class');
var cache = require('../cache');

var EVENTS = 'listeners';

module.exports = Class('Emitter').extend({

  on: function on ( type, handler ){
    var events = cache( this, EVENTS ) || cache( this, EVENTS, {});
    // initialize a new list of handlers
    if ( events[ type ] == null ){
      events[ type ] = [];
    }
    if ( typeof handler === 'function' ){
      return 0 < events[ type ].push( handler )
    }
  },

  off: function off ( type, handler ){
    var events = cache( this, EVENTS );
    if ( events && events[ type ] != null ){
      var orig = events[ type ].length;
      // clear out handlers, all when handler is undefined
      events[ type ] = events[ type ].filter(function( callback ){
        return handler != null && callback !== handler;
      });
      return orig > events[ type ].length;
    }
  },

  emit: function emit ( type, args, scope ){
    var events = cache( this, EVENTS );
    if ( events && events[ type ] != null ){
      // stop propagating if a handler returns false
      return events[ type ].every(function( callback ){
        return callback.apply( this, args ) !== false;
      }, scope || this );
    }
  }

});
