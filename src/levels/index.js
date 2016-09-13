module.exports = function( n ){
  n = n || 0;
  if ( n % w ){
    return { w: 10 + n, h: 10 + n, t: n || '', n:n };
  }
  else {
    return { w: 10 + n, h: 10 + n, t: words[ n / w ] || n || '', n:n };
  }
};

var w = 10;

var words = [
  '',
  'ten',
  'awry',
  'js13k',
  'forty',
  'epic',
  'unreal',
  'awesome',
  'eighty',
  'hello whorl',
  'century'
];
