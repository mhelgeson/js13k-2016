// var tinymusic = require('tinymusic');

var Emitter = require('../Emitter');
var Maze = require('../Maze');
var view = require('../view');
var levels = require('../levels');
var store = require('../store');

// initialize the game...
module.exports = function(){

  view.setup();

  var maze, level = parseInt( store.get('level') ) || 0;

  start( level );

  global.document.body.addEventListener("mousedown", function( event ){
    var x = ( global.innerWidth / 2 ) - event.pageX;
    var y = ( global.innerHeight / 2 ) - event.pageY;
    var a = Math.atan2( y, x ) * 180 / Math.PI;
    switch ( Math.round( a/90 ) ){
      case 1: // UP
        maze.move('N');
        break;
      case 2: // RIGHT
      case -2: // RIGHT
        maze.move('E');
        break;
      case -1: // DOWN
        maze.move('S');
        break;
      case 0: // LEFT
      case -0: // LEFT
        maze.move('W');
        break;
      default: return;
    }
  });

  global.document.body.addEventListener("keydown", function( event ){
    switch( event.keyCode ){
      case 38: // UP
        maze.move('N');
        break;
      case 39: // RIGHT
        maze.move('E');
        break;
      case 40: // DOWN
        maze.move('S');
        break;
      case 37: // LEFT
        maze.move('W');
        break;
      default: return;
    }
    event.preventDefault();
  }, false );

  function start ( n ){

    store.set('level', n );

    maze = new Maze( levels( n ) );

    maze.on('done',function(){
      // console.log('done');
      view.init( maze );
      view.render( maze );
    });

    maze.on('move',function( dx, dy ){
      maze.locked = true;
      view.animate( dx, dy, function(){
        view.render( maze );
        maze.locked = false;
      })
    });

    maze.on('solved',function( moves ){
      store.set( level, moves );
      start( level += 1 );
    });


    maze.on('glitch',function(){
      view.glitch = true;
      view.init( maze );
      view.render( maze );
      setTimeout(function(){
        view.glitch = false;
        view.init( maze );
        view.render( maze );
      }, 420 );
    });

  }

};

