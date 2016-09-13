/*
  Read letters text file, write letters json file
*/

var fs = require('fs');
var path = require('path');
var forEach = Array.prototype.forEach;
var masks = require('../src/masks');

var IN = path.resolve('src/letters/letters.txt');
var OUT = path.resolve('src/letters/index.js');

fs.readFile( IN, function( err, data ){
  var list = [], y = 0, x = 0;
  var lines = data.toString()
    // remove spaces...
    .replace(/ /g,'')
    // separate lines
    .split('\n');
  // extract 5 bits from a line `n`
  var char = function ( n ){
    return lines[ y + n ].substr( x, 5 );
  };
  // loop through all lines
  while ( list.length < 36 ){
    for ( x=0; x<lines[0].length; x+=5 ){
      list.push( char(0) + char(1) + char(2) + char(3) + char(4) );
    }
    y += 6;
  }
  var map = {};
  // console.log( list.join('\n') );
  forEach.call('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',function( ltr, i ){
    map[ ltr ] = list[ i ].split('').map(function( char ){
      switch ( char ){
        default:
        case '·': return 0;
        case '#': return ( masks.A ); // FILLED
        case '╀': return ( masks.N ); // N
        case '┾': return ( masks.E ); // E
        case '╄': return ( masks.N | masks.E ); // NE
        case '╁': return ( masks.S ); // S
        case '╂': return ( masks.N | masks.S ); // NS
        case '╆': return ( masks.S | masks.E ); // SE
        case '╊': return ( masks.N | masks.S | masks.E ); // NSE
        case '┽': return ( masks.W ); // W
        case '╃': return ( masks.W | masks.N ); // WN
        case '┿': return ( masks.W | masks.E ); // WE
        case '╇': return ( masks.W | masks.N | masks.E ); // WNE
        case '╅': return ( masks.W | masks.S ); // WS
        case '╉': return ( masks.W | masks.N | masks.S ); // WNS
        case '╈': return ( masks.W | masks.S | masks.E ); // WSE
        case '╋': return ( masks.W | masks.N | masks.S | masks.E ); // NSEW
      }
    });
  })
  // console.log( map );
  fs.writeFile( OUT, 'module.exports = '+ JSON.stringify( map, null, '  ' ), function( err ){
    if ( err ) console.error( err );
    else console.log('Wrote: '+ OUT );
  })
});



/*

A B C D E F
G H I J K L
M N O P Q R
S T U V W X
Y Z 0 1 2 3
4 5 6 7 8 9

╀ N
┾ E
╄ NE
╁ S
╂ NS
╆ SE
╊ NSE
┽ W
╃ WN
┿ WE
╇ WNE
╅ WS
╉ WNS
╈ WSE
╋ NSEW

*/
