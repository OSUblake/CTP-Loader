System.registerDynamic("npm:get-canvas-context@1.0.1/index.js", [], true, function($__require, exports, module) {
  ;
  var define;
  var global = this;
  var GLOBAL = this;
  module.exports = getCanvasContext;
  function getCanvasContext(type, opts) {
    if (typeof type !== 'string') {
      throw new TypeError('must specify type string');
    }
    if (typeof document === 'undefined') {
      return null;
    }
    opts = opts || {};
    var canvas = opts.canvas || document.createElement('canvas');
    if (typeof opts.width === 'number') {
      canvas.width = opts.width;
    }
    if (typeof opts.height === 'number') {
      canvas.height = opts.height;
    }
    var attribs = opts;
    var gl;
    try {
      var names = [type];
      if (type.indexOf('webgl') === 0) {
        names.push('experimental-' + type);
      }
      for (var i = 0; i < names.length; i++) {
        gl = canvas.getContext(names[i], attribs);
        if (gl)
          return gl;
      }
    } catch (e) {
      gl = null;
    }
    return (gl || null);
  }
  return module.exports;
});

System.registerDynamic("npm:get-canvas-context@1.0.1.js", ["npm:get-canvas-context@1.0.1/index.js"], true, function($__require, exports, module) {
  ;
  var define;
  var global = this;
  var GLOBAL = this;
  module.exports = $__require('npm:get-canvas-context@1.0.1/index.js');
  return module.exports;
});

System.registerDynamic("npm:2d-context@1.3.0/index.js", ["npm:get-canvas-context@1.0.1.js"], true, function($__require, exports, module) {
  ;
  var define;
  var global = this;
  var GLOBAL = this;
  var getContext = $__require('npm:get-canvas-context@1.0.1.js');
  module.exports = function get2DContext(opt) {
    return getContext('2d', opt);
  };
  return module.exports;
});

System.registerDynamic("npm:2d-context@1.3.0.js", ["npm:2d-context@1.3.0/index.js"], true, function($__require, exports, module) {
  ;
  var define;
  var global = this;
  var GLOBAL = this;
  module.exports = $__require('npm:2d-context@1.3.0/index.js');
  return module.exports;
});

System.registerDynamic("test.js", ["npm:2d-context@1.3.0.js"], true, function($__require, exports, module) {
  ;
  var define;
  var global = this;
  var GLOBAL = this;
  var context = $__require('npm:2d-context@1.3.0.js');
  var canvas = document.createElement('canvas');
  console.log("CTX", context({
    canvas: canvas,
    alpha: true,
    width: 256,
    height: 256
  }));
  console.log("THIS", this);
  return module.exports;
});

//# sourceMappingURL=bundle.js.map