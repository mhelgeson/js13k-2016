var UglifyJS = require('uglify-js');

var content = '';

process.stdin
  .on('data', function( data ){
    content += data.toString();
  })
  .on('end',function(){
    process.stdout.write( minify( content ) );
  });

// minify code string with options
function minify ( code ){
  return UglifyJS.minify( code, {
    fromString: true,
    mangle: true,
    compress: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: true,
      // collapse_vars: true,
      // unsafe_comps: true,
      // comparisons: true
    }
  }).code;
}
