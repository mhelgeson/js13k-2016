var assert = require('assert');
var animate = require('../animate');

describe('src/animate',function(){

  it('exports an object',function(){
    assert.equal( typeof animate, 'object' );
  });

  it('has a `next` method',function(){
    assert.equal( typeof animate.next, 'function' );
  });

  it('has a `cancel` method',function(){
    assert.equal( typeof animate.cancel, 'function' );
  });

});
