/*

  Task: collects all required js modules into a single file

*/

var fs = require('fs');
var path = require('path');
var defreq = require('./defreq');

var guid = 1, cache = Object.create(null);

defreq({
  exports: {
    game: path.resolve('./src/game'),
  },
  alias: function( str ){
    return cache[ str ] || ( cache[ str ] = guid++ );
  },
});
