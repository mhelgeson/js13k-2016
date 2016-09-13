
// ACTIVE CELL
exports.A = 1 << 0;

// NORTH WALL or PATH
exports.N = 1 << 1;

// EAST WALL or PATH
exports.E = 1 << 2;

// SOUTH WALL or PATH
exports.S = 1 << 3;

// WEST WALL or PATH
exports.W = 1 << 4;

// HORIZONTAL TUNNEL or PATH
exports.H = 1 << 5;

// VERTICAL TUNNEL or PATH
exports.V = 1 << 6;

// check if a value contains the masked bits
exports.test = function( val, bits ){
  return ( val & bits ) === bits;
};

exports.NS = exports.N | exports.S;
exports.EW = exports.E | exports.W;

exports.map = {
  N: 'north',
  E: 'east',
  S: 'south',
  W: 'west',
}
