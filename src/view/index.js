var anim = require('../animate');
var Canvas = require('../Canvas');
var cells = require('../cells');
var lines = require('../lines');

var canvas;
var walls;
var lines;
var last;
// pixels of each grid cell
var size = 40;
// for center pos of active cell
var cx = .5;
var cy = .75;
// viewport offset
var offset_x = 0;
var offset_y = 0;
// animation frames
var queue = [];

// initialize the canvas
function setup (){
  canvas = new Canvas( document.body );
  document.body.style.margin = 0;
  document.body.style.overflow = 'hidden';
  canvas.scale = 1;

  global.addEventListener('resize', resize , false );

  var adj = size;
  global.addEventListener('wheel',function( event ){
    adj += event.deltaY > 0 ? 2 : event.deltaY < 0 ? -2 : 0;
    var snap = Math.round( adj / 8 ) * 8;
    snap = Math.min( Math.max( 8, snap ), 256 );
    if ( snap != size ){
      // console.log( event.deltaY, snap );
      size = adj = snap;
      // console.log('size:', size );
      init();
      render();
    }
  }, false );

  resize();
};

function resize (){
  var view_w = global.innerWidth;
  var view_h = global.innerHeight;
  canvas.size( view_w, view_h );
  if ( last ) render();
}

// initialize the maze walls
function init ( grid ){
  grid = last = grid || last;
  walls = new Canvas();
  walls.size( grid.width * size, grid.height * size );
  walls.scale = 1;
  grid.data.forEach( draw, this );
}

// render the canvas
function render ( grid ){
  grid = last = grid || last;

  // how many cells wide and high to render?
  var x = grid.active.x;
  var y = grid.active.y;

  cx = ( x + 1 ) / ( grid.width + 2 );
  cy = ( y + 1 ) / ( grid.height + 2 );

  offset_x = canvas.w < walls.w
    ? cx * canvas.w - x * size - size/2
    : canvas.w/2 - walls.w/2;
  offset_y = canvas.h < walls.h
    ? cy * canvas.h - y * size - size/2
    : canvas.h/2 - walls.h/2;

  // paint every cell...
  grid.path.forEach( draw, this );
  // cover up the outermost borders
  walls.path().rect( 0, 0, walls.w, walls.h ).stroke('#fff', size/2 );
  paint();
};

// draw a single cell...
function draw ( cell ){
  if ( !cell ){
    return;
  }
  var x = cell.x * size;
  var y = cell.y * size;

  walls.ctx.clearRect( x, y, size, size );

  if ( cell.clr && exports.glitch ){
    walls.path()
      .rect(
        cell.x * size, // x pos
        cell.y * size, // y pos
        size,
        size
      )
      .alpha(.2)
      .fill( cell.clr )
      .alpha(1);
  }

  walls.alpha(1).ctx.drawImage(
    lines( cell.line, size ).elem, // source
    cell.x * size, // x pos
    cell.y * size // y pos
  );

  walls.ctx.drawImage(
    cells( cell.wall, size, cell.marked == 'glitch' ? '#ABC' : null ).elem, // source
    cell.x * size, // x pos
    cell.y * size // y pos
  );

};
function paint (){
  canvas.clear();
  canvas.ctx.drawImage( walls.elem, offset_x, offset_y );
}

function animate ( dx, dy, callback ){
  var len = 8;

  var x = last.active.x;
  var y = last.active.y;
  // calculate a temp offset ratio
  var cx1 = ( x + 1 ) / ( last.width + 2 );
  var cy1 = ( y + 1 ) / ( last.height + 2 );
  // calculate the next offset positions...

  var offset_x1 = canvas.w < walls.w ? cx1 * canvas.w - x * size - size/2 : canvas.w/2-walls.w/2;
  var offset_y1 = canvas.h < walls.h ? cy1 * canvas.h - y * size - size/2 : canvas.h/2-walls.h/2;
  // var offset_x1 = cx1 * canvas.w - x * size - size/2;
  // var offset_y1 = cy1 * canvas.h - y * size - size/2;
  // get the difference bewteen old/new offsets, per frame
  x = ( offset_x1 - offset_x ) / len;
  y = ( offset_y1 - offset_y ) / len;

  for ( var i=0; i<len; i++ ){
    queue.push(function(){
      offset_x += x;
      offset_y += y;
      paint();
    });
  }
  queue.push( callback );
  run();
}

function run (){
  if ( queue.length ){
    queue.shift()();
    anim.next( run );
  }
}

exports.setup = setup;
exports.init = init;
exports.render = render;
exports.draw = draw;
exports.animate = animate;
