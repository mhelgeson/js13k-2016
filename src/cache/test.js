var assert = require('assert');
var cache = require('../cache');

describe('src/cache',function(){

  var obj = {};

  it('is a function',function(){
    assert.equal( typeof cache, 'function' );
  });

  it('uses a non-enumerable property',function(){
    assert.equal( cache( obj ), undefined );
    assert.equal( Object.keys( obj ).length, 0 );
  });

  it('gets and sets values',function(){
    cache( obj, 'value', 123 );
    assert.equal( cache( obj, 'value' ), 123 );
    cache( obj, 'deep.ns.value', 456 );
    assert.equal( cache( obj, 'deep.ns.value' ), 456 );
  });

});
