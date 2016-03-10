System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "bundle.js": [
      "test.js",
      "npm:2d-context@1.3.0.js",
      "npm:2d-context@1.3.0/index.js",
      "npm:get-canvas-context@1.0.1.js",
      "npm:get-canvas-context@1.0.1/index.js"
    ]
  },

  map: {
    "2d-context": "npm:2d-context@1.3.0",
    "npm:2d-context@1.3.0": {
      "get-canvas-context": "npm:get-canvas-context@1.0.1"
    }
  }
});
