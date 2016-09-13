var assert = require('assert');

var Class = require('../Class');

describe('src/Class',function(){

  it('is a function',function(){
    assert.equal( typeof Class, 'function' );
  });

  it('throws when `name` is not a string or null',function(){
    [ 123, true, [], {}, function(){}, /abc/ ].forEach(function( val ){
      assert.throws(function(){
        Class( val );
      }, function( err ){
        assert.equal( err instanceof TypeError, true );
        return true;
      });
    });
  });

  it('returns class constructors',function(){
    var C = Class();
    assert.equal( typeof C, 'function' );
    assert.equal( C.name, 'Class' );
    assert.equal( typeof C.prototype, 'object' );
  });

  it('creates named classes',function(){
    var C = Class('ClassName');
    assert.equal( C.name, 'ClassName' );
  });

  it('classes support lazy instantiation',function(){
    var C = Class();
    assert.equal( new C() instanceof C, true );
    assert.equal( C() instanceof C, true );
  });

  it('invokes `construct` method on instantiation',function(){
    var Sum = Class().extend({
      construct: function( a, b, c ){
        this.equals = a + b + c;
      }
    });
    var sum = new Sum( 1, 2, 3 );
    assert.equal( sum.equals, 6 );
  });

  describe('.extends()',function(){

    it('static method for inheritence',function(){
      var C = Class(), B = Class();
      assert.equal( typeof C.extends, 'function' );
      assert.equal( C() instanceof B, false );
      assert.equal( C.prototype.super, null );
      C.extends( B );
      assert.equal( C() instanceof B, true );
      assert.equal( C.prototype.super.constructor, B );
    });

    it('only accepts functions',function(){
      [ 'abc', 123, true, [], {}, /abc/ ].forEach(function( val ){
        assert.throws(function(){
          Class().extends( val );
        }, function( err ){
          assert.equal( err instanceof TypeError, true );
          return true;
        });
      });
    });

    it('cannot be called twice on a single class',function(){
      assert.throws(function(){
        Class('A').extends( Class('B') ).extends( Class('C') );
      },function(err){
        assert.equal( err instanceof TypeError, true );
        return true;
      });

    });
  });

  describe('.extend()',function(){

    it('static method for prototype mixins',function(){
      var C = Class(), c = C();
      assert.equal( typeof C.extend, 'function' );
      assert.equal( c.p1, null );
      assert.equal( c.p2, null );
      C.extend({ p1: 123 },{ p2: 456 });
      assert.equal( c.p1, 123 );
      assert.equal( c.p2, 456 );
    });

  });

});


