var context = require('2d-context');

var canvas = document.createElement('canvas')

console.log("CTX", context({
  canvas: canvas,
  alpha: true,
  width: 256,
  height: 256
}));

console.log("THIS", this);