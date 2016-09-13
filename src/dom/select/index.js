/*
  Find elements with `querySelectorAll`
*/

var slice = Array.prototype.slice;

module.exports = function dom_select ( selector, base ){
  return slice.call( ( base || document ).querySelectorAll( selector ) );
};
