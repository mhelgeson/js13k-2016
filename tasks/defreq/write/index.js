// core modules
var fs = require('fs');
var path = require('path');
var mkpath = require('mkpath');
var debug = require('debug')('defreq:write');

// TODO: callback is not completely implemented
module.exports = function( config, graph, callback ){

  function alias ( str ){
    return JSON.stringify( config.alias( str ) );
  }

  function template ( id, body ){
    // module template loaded from file
    return template.string
      // inject the module_id
      .replace( config.module_id, id )
      // inject the module body
      .replace( config.module_body,
        // indent every line of the body, trim trailing spaces
        body.replace(/\n/g,"\n  ").replace(/\s+$/,"")
      );
  }

  // load the template that will be used to define each module
  template.string = fs.readFileSync( config.module ).toString();

  // create an output stream...
  var output = config.output || process.stdout;
  if ( typeof output === 'string' ){
    mkpath.sync( path.dirname( output ) );
    var output = fs.createWriteStream( output );
  }

  // TODO: callback is not completely implemented
  // output.on('finish', callback );

  // begin the output
  output.write( config.prefix );

  // append the browser "define/require" function shims
  output.write( fs.readFileSync( config.define ) );

  // append each [wrapped] dependent module
  graph.defines.forEach(function( mod ){
    var id = alias( mod.filename ), body;
    debug('define(%s) %s', id, mod.filename );
    try {
      // get the module body
      body = fs.readFileSync( mod.filename ).toString();
    }
    catch ( ex ){
      body = "";
    }
    // go through dependencies
    mod.requires.forEach(function( mod ){
      var id = alias( mod.filename ),
      // expression to match the path used in a require call...
      regex = new RegExp('require\\(["\']' + mod.path + '["\']\\)',"g");
      // replace the include path with the filename alias
      body = body.replace( regex, 'require(' + id + ')' );
      debug('> require(%s) %s', id, mod.filename );
    });
    // write out the wrapped module
    output.write('\n/* '+ mod.filename +' */');
    output.write( template( id, body ) );
  });

  var names = Object.keys( config.exports );
  // append `require` statements for "main" modules
  graph.requires.forEach(function( filename, i ){
    var id = alias( filename ),
    name = JSON.stringify( names[i] );
    output.write('\nglobal['+ name +'] = require('+ id +');\n');
    debug('require(%s) %s', id, filename );
  });

  // finish the output
  output.write( config.suffix );
  return output;
};
