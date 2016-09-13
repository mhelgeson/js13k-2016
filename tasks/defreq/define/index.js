var modules = Object.create( null );

function define ( name, module ) {
  if ( !! modules[ name ] ) {
    throw new Error('Module is already defined (' + name + ')');
  }
  modules[ module.id = name ] = { c: module };
}

function require ( name ){
  if ( ! modules[ name ] ){
    throw new Error('Module is not defined (' + name + ')');
  }
  var module = modules[ name ];
  if ( module.exports == null ){
    module.c( module.exports = {}, require, module );
  }
  return module.exports;
}
