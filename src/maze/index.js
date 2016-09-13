/*
  Manage the maze grid
*/

var masks = require('../masks');
var Class = require('../Class');
var Emitter = require('../Emitter');
var seedrandom = require('seedrandom/seedrandom');
var nextTick = require('../next');
var letters = require('../letters');

module.exports = Class('Grid').extends( Emitter ).extend({
  construct: function( opts ){
    // pad the dimensions with a border row
    this.width = opts.w + 2;
    this.height = opts.h + 2;
    this.prng = seedrandom( JSON.stringify( opts ) );
    this.init();
    this.write( opts.t );
    this.glitch( opts.n );
    this.generate();
    this.moves = 0;
  },

  // initialize the grid cells data structures
  init: function( n ){
    this.path = [];
    this.data = [];
    // populate the grid with cells...
    for ( var y = 0, h = this.height-1; y <= h; y++ ){
      for ( var x = 0, w = this.width-1; x <= w; x++ ){
        this.data.push({
          n: this.data.length,
          x: x,
          y: y,
          wall: (
            !y || y == h ? ( x != w ? masks.E : 0 ) | ( x ? masks.W : 0 ) : 0
          ) | (
            !x || x == w ? ( y != h ? masks.S : 0 ) | ( y ? masks.N : 0 ) : 0
          ),
          line: 0
        });
      }
    }
  },

  // sprinkle in some glitches...
  glitch: function( n ){
    while ( n ){
      var cell = this.random( this.data );
      if ( cell.wall == 0 ){
        cell.marked = 'glitch';
        n -= 1;
        // console.log( cell );
      }
    }
  },

  // apply the configured message to the maze grid
  write: function( msg ){
    if ( msg = String( msg ) ){
      var w = 6;
      var min = 3;
      // find a random location
      var x = min + Math.round( this.prng() * ( this.width - 2 - msg.length * w - min ) );
      var y = min + Math.round( this.prng() * ( this.height - w - 2 - min ) );
      msg.toUpperCase().split('').forEach(function( char ){
        ( letters[ char ] || [] ).forEach(function( v, n ){
          this.cell( x + n % 5, y + Math.floor( n / 5 ) ).wall = v;
        }, this );
        x += w;
      }, this );
    }
  },

  random: function( list ){
    return list[ Math.floor( this.prng() * list.length ) ];
  },

  generate: function(){

    var origin = this.origin();
    origin.marked = 'origin';
    origin.clr = '';

    this.paths = 4;
    this.carve( origin, [], '#e77');
    this.carve( origin, [], '#ee7');
    this.carve( origin, [], '#7e7');
    this.carve( origin, [], '#77e');
  },

  // get a random *unvisited* cell
  origin: function(){
    var cell;
    do cell = this.random( this.data );
    while ( cell.wall != 0 || this.available( cell ).length != 4 )
    return cell;
  },

  carve: function( cell, stack, clr ){
    var self = this;
    var moves = this.available( cell );
    var tunnel;
    cell.clr = cell.clr != null ? cell.clr : clr;
    // move forward...
    if ( moves.length ){
      stack.push( cell );
      var next = this.random( moves );
      if ( next.y < cell.y ){ // NORTH
        cell.wall |= masks.N;
        next.wall = masks.S;
        if ( next.y - cell.y < -1 ){ // TUNNEL
          tunnel = this.cell( cell.x, cell.y - 1 );
          tunnel.wall |= masks.V;
        }
      }
      if ( next.x > cell.x ){ // EAST
        cell.wall |= masks.E;
        next.wall = masks.W;
        if ( next.x - cell.x > +1 ){ // TUNNEL
          tunnel = this.cell( cell.x + 1, cell.y );
          tunnel.wall |= masks.H;
        }
      }
      if ( next.y > cell.y ){ // SOUTH
        cell.wall |= masks.S;
        next.wall = masks.N;
        if ( next.y - cell.y > +1 ){ // TUNNEL
          tunnel = this.cell( cell.x, cell.y + 1 );
          tunnel.wall |= masks.V;
        }
      }
      if ( next.x < cell.x ){ // WEST
        cell.wall |= masks.W;
        next.wall = masks.E;
        if ( next.x - cell.x < -1 ){ // TUNNEL
          tunnel = this.cell( cell.x - 1, cell.y );
          tunnel.wall |= masks.H;
        }
      }
      stack.push( next );
      this.emit('carve');
      nextTick(function(){
        self.carve( next, stack, clr );
      });
    }
    // backtrack
    else if ( stack.length > 1 ){
      nextTick(function(){
        self.carve( stack.pop(), stack, clr );
      });
    }
    else {
      console.log('%c done ','background:'+ clr );
      this.done();
      return;
    }
  },

  // consider flipping tunnels for better weaving
  weave: function(){
    this.data.forEach(function( cell ){
      var n = this.north( cell, 1 );
      var e = this.east( cell, 1 );
      var s = this.south( cell, 1 );
      var w = this.west( cell, 1 );
      // found a vertical tunnel...
      if ( masks.test( cell.wall, masks.V ) ){
        // is any neighbor a horizontal tunnel?
        if ( masks.test( n.wall, masks.H ) || masks.test( e.wall, masks.H ) || masks.test( s.wall, masks.H ) || masks.test( w.wall, masks.H )){
          // cell.clr = '#F00';
          return; // can't or won't flip
        }
        // flip it...
        if ( masks.test( e.wall, masks.V ) || masks.test( w.wall, masks.V ) || this.random([1,0]) ){
          cell.wall = masks.N | masks.S | masks.H;
          cell.clr = ( n.clr || s.clr );//'#F0F';
          // cell.clr = '#0F0';
        }
        // else cell.clr = '#00F';
      }
      // found a horizontal tunnel...
      if ( masks.test( cell.wall, masks.H ) ){
        // is any neighbor a vertical tunnel?
        if ( masks.test( n.wall, masks.V ) || masks.test( e.wall, masks.V ) || masks.test( s.wall, masks.V ) || masks.test( w.wall, masks.V )){
          // cell.clr = '#F00';
          return; // can't or won't flip
        }
        // flip it...
        if ( masks.test( n.wall, masks.H ) || masks.test( s.wall, masks.H ) || this.random([1,0]) ){
          cell.wall = masks.E | masks.W | masks.V;
          cell.clr = ( e.clr || w.clr );//'#F0F';
          // cell.clr = '#0F0';
        }
        // else cell.clr = '#00F';
      }
    }, this );
  },

  // get the neighboring *unvisited* cells
  available: function( cell ){
    return ([
      this.north( cell ),
      this.east( cell ),
      this.south( cell ),
      this.west( cell ),
    ]).filter(function( next ){
      // make sure they are valid and unvisited
      return next && next.wall === 0;
    })

  },

  done: function(){
    this.paths -= 1;
    if ( !this.paths ){
      this.weave();
      // find a suitable entrance/exit...
      var w = this.width;
      var bottom = this.data.slice( -2 * w, -w ).slice(1,-1);
      var top = this.data.slice( w, 2 * w ).slice(1,-1);
      do {
        var enter = this.random( bottom );
        var exit = this.random( top );
      // make sure they are on different paths
      } while ( enter.clr == exit.clr );
      // open entrance walls...
      enter.wall |= masks.S;
      enter = this.south( enter, 1 );
      enter.wall |= masks.N;
      enter.marked = 'enter';
      // open exit walls...
      exit.wall |= masks.N;
      exit = this.north( exit, 1 );
      exit.wall |= masks.S;
      exit.marked = 'exit';
      this.path.push( this.active = enter );
      enter.line = masks.A;
      this.emit('done');
    }
  },

  // get the cell data from x,y coords
  cell: function( x, y ){
    return x != null && y != null
      ? this.data[ parseInt(y) * this.width + parseInt(x) ]
      : {};
  },

  // get the next cell in a direction...
  north: function( cell, dist ){
    var next = this.cell( cell.x, cell.y - 1 ) || {};
    if ( !dist && ( masks.test( next.wall, masks.V ) || next.wall == masks.EW ) ){
      return this.north( next, 1 );
    }
    return next;
  },
  east: function( cell, dist ){
    var next = this.cell( cell.x + 1, cell.y ) || {};
    if ( !dist && ( masks.test( next.wall, masks.H ) || next.wall == masks.NS ) ){
      return this.east( next, 1 );
    }
    return next;
  },
  south: function( cell, dist ){
    var next = this.cell( cell.x, cell.y + 1 ) || {};
    if ( !dist && ( masks.test( next.wall, masks.V ) || next.wall == masks.EW ) ){
     return this.south( next, 1 );
    }
    return next;
  },
  west: function( cell, dist ){
    var next = this.cell( cell.x - 1, cell.y ) || {};
    if ( !dist && ( masks.test( next.wall, masks.H ) || next.wall == masks.NS ) ){
      return this.west( next, 1 );
    }
    return next;
  },
  // set the active cell, extend the path
  move: function( dir, alt ){
    if ( this.locked ) return;
    var prev = this.active, cell, valid = prev.wall;
    if ( prev.marked == 'enter' || prev.marked == 'exit' ){
      valid &= ~( masks.E | masks.W );
    }
    if ( valid & masks[ dir ] ){
      cell = this[ masks.map[ dir ] ]( prev );
    }
    else { // move is not valid
      return;
    }
    this.moves += 1;
    var dx = cell.x - prev.x;
    var dy = cell.y - prev.y;
    var draw = !( cell.line & ( masks.N | masks.E | masks.S | masks.W) );
    prev.line &= ~masks.A;
    cell.line |= masks.A;
    if ( dy < 0 ){ // NORTH
      draw ? prev.line |= masks.N : prev.line &= ~masks.N;
      draw ? cell.line |= masks.S : cell.line &= ~masks.S;
      if ( dy < -1 ){ // TUNNEL
        var tunnel = this.north( prev, 1 );
        draw ? tunnel.line |= masks.V : tunnel.line &= ~masks.V;
      }
    }
    else if ( dx > 0 ){ // EAST
      draw ? prev.line |= masks.E : prev.line &= ~masks.E;
      draw ? cell.line |= masks.W : cell.line &= ~masks.W;
      if ( dx > 1 ){ // TUNNEL
        var tunnel = this.east( prev, 1 );
        draw ? tunnel.line |= masks.H : tunnel.line &= ~masks.H;
      }
    }
    else if ( dy > 0 ){ // SOUTH
      draw ? prev.line |= masks.S : prev.line &= ~masks.S;
      draw ? cell.line |= masks.N : cell.line &= ~masks.N;
      if ( dy > 1 ){ // TUNNEL
        var tunnel = this.south( prev, 1 );
        draw ? tunnel.line |= masks.V : tunnel.line &= ~masks.V;
      }
    }
    else if ( dx < 0 ){ // WEST
      draw ? prev.line |= masks.W : prev.line &= ~masks.W;
      draw ? cell.line |= masks.E : cell.line &= ~masks.E;
      if ( dx < -1 ){ // TUNNEL
        var tunnel = this.west( prev, 1 );
        draw ? tunnel.line |= masks.H : tunnel.line &= ~masks.H;
      }
    }
    if ( tunnel ){
      this.path.push( tunnel );
    }
    this.path.push( this.active = cell );
    this.emit('move',[ dx, dy ]);
    if ( this.active.marked == 'origin' || this.active.marked == 'glitch' ){
      this.emit('glitch');
    }
    if ( this.active.marked == 'exit' ){
      this.emit('solved',[ this.moves ]);
    }
  }

});

function pluck ( arr, key ){
  return arr.map(function(o){ return o[ key ]; }).join(',');
}
