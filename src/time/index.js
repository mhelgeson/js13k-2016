// browser high resolution float (milliseconds)
var ms = global.performance ? function(){ return global.performance.now(); }
// server high resolution tuple [ seconds, nanoseconds ]
: global.process ? function(){
  var hr = global.process.hrtime();
  return 1e3 * hr[0] + hr[1] / 1e6;
// fallback low resolution integer (milliseconds)
} : Date.now,

loaded = ms();

// ms time elapsed since module loaded
module.exports = function time (){
  return ms() - loaded;
};
