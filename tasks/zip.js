/*

  Task: compress a single file into a zip archive

*/

var AdmZip = require('adm-zip');

var zip = new AdmZip();
var content = '';

process.stdin.on('data',function( data ){
  content += data.toString();
});

process.stdin.on('end',function(){
  zip.addFile("index.html", content );
  process.stdout.write( zip.toBuffer() );
});

