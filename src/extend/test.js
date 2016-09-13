var assert = require('assert');

var extend = require('../extend');

describe('src/extend',function(){

  it('is a function',function(){
    assert.equal( typeof extend, 'function' );
  });

  it('it copies properties',function(){
    var target = {}, object = { a:1, b:2, c:3 };

    assert.notEqual( target.a, object.a );
    assert.notEqual( target.b, object.b );
    assert.notEqual( target.c, object.c );

    extend.call( target, object );

    assert.equal( target.a, object.a );
    assert.equal( target.b, object.b );
    assert.equal( target.c, object.c );
    assert.notEqual( target, object );

  });

  it('handles bad input',function(){
    var target = {}, object = { x:7, y:8, z:9 };
    extend.call( target, null, false, object );

    assert.equal( target.a, object.a );
    assert.equal( target.b, object.b );
    assert.equal( target.c, object.c );
    assert.notEqual( target, object );

  });

});
