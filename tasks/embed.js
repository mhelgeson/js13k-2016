/*

  Task: embeds the main javascript file in a minimal html page

*/

var content = '';

process.stdin
  .on('data', function( data ){
    content += data.toString();
  })
  .on('end',function(){
    process.stdout.write('<!doctype html><html><head><meta charset="utf-8"></head><body onload="game()"><script>');
    process.stdout.write( content );
    process.stdout.write('</script></body></html>');
  });
