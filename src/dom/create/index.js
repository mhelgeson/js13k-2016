/*

*/

var map = Array.prototype.map;

var patternSingle = /<([a-z0-9]+)\s*\/>/;

module.exports = function dom_create ( html ){
  var single = patternSingle.exec( html );
  if ( single ){
    return [ document.createElement( single[1] ) ];
  }
  // placeholder container
  var div = document.createElement('div');
  // cheaty way to create elements
  div.innerHTML = html;
  // extract the children
  var list = map.call( div.children, function( child ){
    return div.removeChild( child );
  });
  // release allocation
  div = null;
  // return children
  return list;
};
