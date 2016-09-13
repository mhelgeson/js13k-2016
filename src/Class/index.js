/**
 *  @private
 */
var extend = require('../extend');

function Class ( name ){
  if ( name != null && typeof name !== 'string' ){
    throw TypeError("Invalid name passed into `Class`");
  }
  // generate a *named* constructor
  var Class = new Function('create',
    class_constructor.replace( CLASSNAME, name || 'Class' )
  )( Object.create );
  // set the constructor
  Class.prototype.constructor = Class;
  Class.prototype.construct = construct;
  // set a static method for inheritence
  Class.extends = class_extends;
  // set a static method for prototype mixin
  Class.extend = class_extend;
  return Class;
}

var CLASSNAME = /CLASS/g;
var class_constructor = [
  'return function CLASS (){',
    'var obj = this instanceof CLASS ? this : create( CLASS.prototype );',
    'return obj.construct && obj.construct.apply( obj, arguments ) || obj;',
  '};'
].join('');

/**
 *  @public
 */
function class_extends ( Func ){
  if ( typeof Func !== 'function' ){
    throw TypeError("Invalid class passed into `Class.extends`");
  }
  // ensure this can only be called once...
  if ( typeof this.prototype.super !== 'undefined' ){
    throw TypeError("Class already extends a different class");
  }
  // preserve the constructor
  var Class = this.prototype.constructor;
  // apply inheritence from parent class
  this.prototype = Object.create( Func.prototype );
  // set the constructor
  Class.prototype.constructor = Class;
  // reference the parent constructor
  this.prototype.super = Func.prototype;
  return this;
}

/**
 *  @public
 */
function class_extend (){
  // extend the prototype with mixin arguments
  extend.apply( this.prototype, arguments );
  return this;
}

function construct (){ };

/**
 *  @public
 */
module.exports = Class;
