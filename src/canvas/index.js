var Class = require('../Class');
var extend = require('../extend');

module.exports = Class('Canvas').extend({
  construct: function( parent ){
    this.x = this.y = this.w = this.h = 0;
    this.elem = document.createElement('canvas');
    this.ctx = this.elem.getContext('2d');
    if ( parent ){
      parent.appendChild( this.elem );
    }
  },
  scale: 4,
  size: function( width, height ){
    this.w = this.elem.width = width;
    this.h = this.elem.height = height;
    return this;
  },
  css: function( obj ){
    extend.call( this.elem.style, obj || {} );
    return this;
  },
  clear: function( x, y, w, h ){
    this.ctx.clearRect(
      x*this.scale || 0,
      y*this.scale || 0,
      w*this.scale || this.w,
      h*this.scale || this.h
    );
    return this;
  },
  draw: function( callback ){
    callback.call( this, this.ctx );
    return this;
  },
  circ: function( r, x, y ){
    this.ctx.arc( x*this.scale || this.x, y*this.scale || this.y, r*this.scale, 0, 2*Math.PI, false );
    return this;
  },
  rect: function( x, y, w, h ){
    this.ctx.rect( x*this.scale || this.x, y*this.scale || this.y, w*this.scale || this.w, h*this.scale || this.h );
    return this;
  },
  move: function( x, y ){
    this.ctx.moveTo( this.x = x*this.scale, this.y = y*this.scale );
    return this;
  },
  line: function( x, y ){
    this.ctx.lineTo( this.x = x*this.scale, this.y = y*this.scale );
    return this;
  },
  alpha: function( alpha ){
     this.ctx.globalAlpha = alpha || 1;
     return this;
  },
  set: function( opts ){
    extend.call( this.ctx, opts || {} );
    return this;
  },
  path: function( str ){
    this.ctx.closePath();
    this.ctx.beginPath();
    if ( typeof str == 'string' ){
      str.split(' ').forEach(function( cmd ){
        if ( cmd = /^(M|L)(\d+),(\d+)$/.exec( cmd ) ){
          if ( cmd[1] == 'M' ){
            this.move( cmd[2], cmd[3] );
          }
          if ( cmd[1] == 'L' ){
            this.line( cmd[2], cmd[3] );
          }
        }
      }, this );
    }
    return this;
  },
  fill: function( clr ){
    if ( clr ){
      this.ctx.fillStyle = clr;
    }
    this.ctx.fill();
    return this;
  },
  stroke: function( clr, w ){
    if ( clr ){
      this.ctx.strokeStyle = clr;
    }
    if ( w ){
      this.ctx.lineWidth = w;
    }
    this.ctx.lineCap = "round";
    this.ctx.stroke();
    return this;
  },
  url: function(){
    return this.elem.toDataURL();
  }

});
