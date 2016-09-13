/*
  get a cell image
*/

var Canvas = require('../Canvas');
var masks = require('../masks');

var cache = {};

module.exports = function( val, size, clr ){
  // clr = '';
  // check the cache...
  if ( !cache[ size ] ){
    cache[ size ] = {};
  }
  if ( !cache[ size ][ clr ] ){
    cache[ size ][ clr ] = {};
  }
  if ( !cache[ size ][ clr ][ val ] ){
    var stroke_color = '#111';
    var fill_color = '#777';//'#ABC';
    var line_color = clr || '#7fe57f';//'#789';
    var end_color = clr || '#0C0';
    var stroke_width = 2;
    var line_width = size/3;
    var canvas = new Canvas().size( size, size )//.alpha(.75);
    canvas.scale = size / 8;
    if ( val & masks.H ){ // HORIZONTAL TUNNEL
      canvas.path('M0,4 L8,4 Z').stroke( line_color, line_width )
        .path('M1,1 L1,7 L7,7 L7,1 Z').fill('rgba(255,255,255,.75)', line_width )
    }
    if ( masks.test( val, masks.V ) ){ // VERTICAL TUNNEL
      canvas.path('M4,0 L4,8 Z').stroke( line_color, line_width )
        .path('M1,1 L1,7 L7,7 L7,1 Z').fill('rgba(255,255,255,.75)', line_width )
    }
    if ( val & masks.N ){
      canvas.path('M4,4 L4,0 Z').stroke( line_color, line_width );
    }
    if ( val & masks.E ){
      canvas.path('M4,4 L8,4 Z').stroke( line_color, line_width );
    }
    if ( val & masks.S ){
      canvas.path('M4,4 L4,8 Z').stroke( line_color, line_width );
    }
    if ( val & masks.W ){
      canvas.path('M4,4 L0,4 Z').stroke( line_color, line_width );
    }
    // remove the weaves and look for terminal ends
    // var dir = val & ( masks.N | masks.S | masks.E | masks.W );
    // if ( dir == masks.N || dir == masks.E || dir == masks.S || dir == masks.W ){
    if ( val & masks.A ){
      canvas.path().alpha(1)
        .move(4,4).circ(2)
        // .stroke('#FFF',stroke_width*2)
        .fill( end_color );
    }
    cache[ size ][ clr ][ val ] = canvas;
    // console.log( cache, size, clr, val );
  }
  return cache[ size ][ clr ][ val ];
}
