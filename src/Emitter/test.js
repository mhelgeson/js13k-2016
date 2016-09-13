var assert = require('assert');
var Emitter = require('../Emitter');
var cache = require('../cache');

describe('src/Emitter',function(){

  var emitter, count = 0, callback = function(){ count += 1; };

  it('is a class',function(){
    assert.equal( typeof Emitter, 'function' );
  });

  describe('#on( type, callback )',function(){

    it('is a function',function(){
      assert.equal( typeof Emitter.prototype.on, 'function' );
    });

    it('can be called without arguments',function(){
      Emitter().on();
    });

    it('requires two arguments',function(){
      var registered = true;
      // nothing registered
      registered = Emitter().on();
      assert.notEqual( registered, true );
      // nothing registered
      registered = Emitter().on( null );
      assert.notEqual( registered, true );
    });

    it('requires `callback` to be a function',function(){
      var registered = true;
      // nothing registered
      registered = Emitter().on('foo', 123 );
      assert.notEqual( registered, true );
      // something registered
      registered = Emitter().on('count:on', callback );
      assert.equal( registered, true );
    });

  });

  describe('#off( type, callback )',function(){

    emitter = Emitter();

    it('is a function',function(){
      assert.equal( typeof Emitter.prototype.off, 'function' );
    });

    it('can be called without arguments',function(){
      emitter.off();
    });

    it('removes one handler',function(){
      count = 0;
      // register a handler
      emitter.on('count:off', callback );
      // make sure it exists
      emitter.emit('count:off');
      assert.equal( count, 1 );
      // remove a handler
      var removed = emitter.off('count:off', callback );
      assert.equal( removed, true );
      // make sure it is gone
      emitter.emit('count:off');
      assert.equal( count, 1 );
    });

    it('removes all handlers',function(){
      count = 0;
      // register three handlers
      emitter.on('count:off', callback );
      emitter.on('count:off', callback );
      emitter.on('count:off', callback );
      // make sure they exist
      emitter.emit('count:off');
      assert.equal( count, 3 );
      // remove the handlers
      var removed = emitter.off('count:off');
      assert.equal( removed, true );
      // make sure they are gone
      emitter.emit('count:off');
      assert.equal( count, 3 );
    });

  });

  describe('#emit( type, args )',function(){

    emitter = Emitter();

    it('is a function',function(){
      assert.equal( typeof Emitter.prototype.emit, 'function' );
    });

    it('can be called without arguments',function(){
      emitter.emit();
    });

    it('invokes callback matching type',function(){
      count = 0;
      // register a handler
      emitter.on('count:emit', callback );
      emitter.emit('count:emit');
      // make sure it emits
      assert.equal( count, 1 );
    });

    it('does not invoke unmatched type',function(){
      count = 0;
      // make sure wrong type doesn't emit
      emitter.emit('count:down');
      assert.equal( count, 0 );
    });

    it('passes arguments into the callback',function(){
      var obj = { n: 0 };
      emitter.on('count:arg', function( arg ){
        arg.n += 1;
      });
      emitter.emit('count:arg', [ obj ]);
      assert.equal( obj.n, 1 );
    });

    it('stops propagating when callback returns `false`',function(){
      var count = 0, onlytwice = function(){ return ( ++count < 2 ); };
      emitter.on('count:stop', onlytwice );
      emitter.on('count:stop', onlytwice );
      emitter.on('count:stop', onlytwice );
      emitter.on('count:stop', onlytwice );
      emitter.emit('count:stop');
      assert.equal( count, 2 );
    });

  });

});
