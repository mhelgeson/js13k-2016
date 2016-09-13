var assert = require('assert');
var def = require('../def');

describe('src/def',function(){

  it('is a function',function(){
    assert.equal( typeof def, 'function' );
  });

  it('expects a string',function(){
    assert.doesNotThrow(function(){
      def('abc');
    });
    assert.doesNotThrow(function(){
      def('abc.def');
    });
    assert.doesNotThrow(function(){
      def('abc.def.ghi');
    });
  });

  it('or throws a TypeError',function(){
    [
      undefined,
      null,
      true,
      123,
      {},
      [],
      Date
    ].forEach(function( val ){
      assert.throws(function(){
        def( val );
      }, TypeError );
    });
  });

  it('returns undefined',function(){
    var val = def('abc');
    assert.equal( val, null );
  });

  it('gets a value',function(){
    var val = def('process');
    assert.equal( typeof val, 'object' );
  });

  it('operates upon `this`',function(){

    var key = 'foo', val = Math.random();

    // as a local/forced scope
    var obj1 = this;
    obj1[ key ] = val;
    var val1 = def.call( obj1, key );
    assert.equal( val1, obj1[ key ] );

    // as a static method
    var obj2 = { def:def };
    obj2[ key ] = val;
    var val2 = obj2.def( key );
    assert.equal( val2, obj2[ key ] );

    // as an instance method
    function Obj (){ this[ key ] = val; }
    Obj.prototype.def = def;
    var obj3 = new Obj(),
    val3 = obj3.def( key );
    assert.equal( val3, obj3[ key ] );

  });

  it('sets a value', function(){
    var key = 'a.b.c', val = Math.random();
    // as a local/forced scope
    var obj1 = this;
    def.call( obj1, key, val );
    assert.equal( obj1.a.b.c, val );
  });

});
