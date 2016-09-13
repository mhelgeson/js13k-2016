/*

  Task: Checks the file size of a single file

*/

var fs = require('fs');
var colors = require('colors');

// path to the file, number of kilobytes
function check_size ( file, limit ){
  var size = fs.statSync( file )["size"] / 1024,
  ok = size <= limit,
  mark = ok ? '✓' : limit ? '✘' : '*',
  color = colors[ ok ? 'green' : limit ? 'red' : 'yellow' ];

  console.log(' ',
    color( mark ),
    colors.gray( file ),
    color(''+ size.toFixed(2) +' kB')
  );
  if ( limit && !ok ){ // failure
    console.log(' ',
      colors.red('Size exceeds the'),
      colors.white( limit +' kB'),
      colors.red('limit!')
    );
    process.exit(1);
  }
};

check_size("./dist.zip", 13 );
