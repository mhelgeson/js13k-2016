/*
  get a cell image
*/

var Canvas = require('../Canvas');
var masks = require('../masks');

var cache = {};

module.exports = function( val, size, clr ){
  // check the cache...
  if ( !cache[ size ] ){
    cache[ size ] = {};
  }
  if ( !cache[ size ][ clr ] ){
    cache[ size ][ clr ] = {};
  }
  if ( !cache[ size ][ clr ][ val ] ){
    var stroke_color = '#111';
    var fill_color = '#444';//'#ABC';
    var line_color = '#7fe57f';//'#789';
    var end_color = '#0C0';
    var stroke_width = 2;
    var line_width = size/3;
    // initialize the cache...
    var canvas = new Canvas().size( size, size );
    canvas.scale = size / 8;
    if ( clr ){
      canvas.alpha(.4).rect().fill( clr ).alpha(1);
    }
    // draw it...
    canvas // FILL: Corners
      .path('M0,0 L1,0 L1,1 L0,1 Z').fill( fill_color ) // NW
      .path('M7,0 L8,0 L8,1 L7,1 Z').fill( fill_color ) // NE
      .path('M7,7 L8,7 L8,8 L7,8 Z').fill( fill_color ) // SE
      .path('M0,7 L1,7 L1,8 L0,8 Z').fill( fill_color ) // SW
    if ( val & masks.N ){
      canvas // STROKE: NORTH-DOOR
        .path('M1,0 L1,1 M7,0 L7,1').stroke( stroke_color, stroke_width )
    }
    else if ( val & masks.V ) {
      canvas // NORTH-TUNNEL
        .path('M1,0 L7,0 L7,1 L1,1 Z').alpha(.15).fill( fill_color ).alpha(1)
        .path('M1,1 L7,1').stroke( stroke_color, stroke_width )
        .path('M1,0 L1,1 M7,0 L7,1').stroke( stroke_color, stroke_width )
    }
    else {
      canvas // NORTH-WALL
        .path('M1,0 L7,0 L7,1 L1,1 Z').fill( fill_color )
        .path('M1,1 L7,1').stroke( stroke_color, stroke_width )
    }
    if ( val & masks.E ){
      canvas // STROKE: EAST-DOOR
        .path('M7,1 L8,1 M7,7 L8,7').stroke( stroke_color, stroke_width )
    }
    else if ( val & masks.H ) {
      canvas // EAST-TUNNEL
        .path('M7,1 L8,1 L8,7 L7,7 Z').alpha(.15).fill( fill_color ).alpha(1)
        .path('M7,1 L7,7').stroke( stroke_color, stroke_width )
        .path('M7,1 L8,1 M7,7 L8,7').stroke( stroke_color, stroke_width )
    }
    else {
      canvas // EAST-WALL
        .path('M7,1 L8,1 L8,7 L7,7 Z').fill( fill_color )
        .path('M7,1 L7,7').stroke( stroke_color, stroke_width )
    }
    if ( val & masks.S ){
      canvas // STROKE: SOUTH-DOOR
        .path('M1,7 L1,8 M7,7 L7,8').stroke( stroke_color, stroke_width )
    }
    else if ( val & masks.V ) {
      canvas // SOUTH-TUNNEL
        .path('M1,7 L7,7 L7,8 L1,8 Z').alpha(.15).fill( fill_color ).alpha(1)
        .path('M1,7 L7,7').stroke( stroke_color, stroke_width )
        .path('M1,7 L1,8 M7,7 L7,8').stroke( stroke_color, stroke_width )
    }
    else {
      canvas // SOUTH-WALL
        .path('M1,7 L7,7 L7,8 L1,8 Z').fill( fill_color )
        .path('M1,7 L7,7').stroke( stroke_color, stroke_width )
    }
    if ( val & masks.W ){
      canvas // STROKE: WEST-DOOR
        .path('M0,1 L1,1 M0,7 L1,7').stroke( stroke_color, stroke_width )
    }
    else if ( val & masks.H ) {
      canvas // WEST-TUNNEL
        .path('M0,1 L1,1 L1,7 L0,7 Z').alpha(.15).fill( fill_color ).alpha(1)
        .path('M1,1 L1,7').stroke( stroke_color, stroke_width )
        .path('M0,1 L1,1 M0,7 L1,7').stroke( stroke_color, stroke_width )
    }
    else {
      canvas // WEST-WALL
        .path('M0,1 L1,1 L1,7 L0,7 Z').fill( fill_color )
        .path('M1,1 L1,7').stroke( stroke_color, stroke_width )
    }
    if ( val & masks.A ){ // SOLID FILL
      canvas.path('M0,0 L8,0 L8,8 L0,8 Z').fill( fill_color );
    }
    cache[ size ][ clr ][ val ] = canvas;
    // console.log( cache, size, clr, val );
  }
  return cache[ size ][ clr ][ val ];
}
