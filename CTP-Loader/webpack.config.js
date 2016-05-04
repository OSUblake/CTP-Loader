module.exports = {
  entry: "./src/geom-modules.js",
  output: {
    filename: "geom-bundles.js",
    path: __dirname + "/src"
    //path: "./src"
  },
  //module: {
  //  loaders: [
  //    {
  //      test: /\.js$/,
  //      loaders: ["script"]
  //    }
  //  ]
  //}
}