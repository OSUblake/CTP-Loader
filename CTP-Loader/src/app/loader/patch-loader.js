var CTP;
(function (CTP) {
    var Loader;
    (function (Loader) {
        var module = Loader.getModule();
        var PatchLoader = (function () {
            function PatchLoader($q, $http, 
                //private logger: ILogger,
                dstRead) {
                this.$q = $q;
                this.$http = $http;
                this.dstRead = dstRead;
                this.patches = [];
            }
            PatchLoader.prototype.createPatch = function (file) {
                var _this = this;
                // TEST
                var deferred = this.$q.defer();
                //var patch = new Patch();
                var canvas = document.querySelector("#mycanvas3");
                var reader = new FileReader();
                reader.onloadend = function (event) {
                    // TEST
                    var patch = new Loader.Patch();
                    var view = new jDataView(event.target.result, 0);
                    //var pattern = new Pattern();
                    var pattern = new Loader.Pattern(patch);
                    _this.dstRead(view, pattern);
                    pattern.moveToPositive();
                    pattern.drawShape(canvas);
                    // TEST NO RENDER
                    //this.render(pattern);
                    // TEST
                    patch.width = pattern.right;
                    patch.height = pattern.bottom;
                    //_.forEach(patch.layers, layer => layer.createPoints());
                    //_.forEach(patch.layers, layer => layer.createShapes());
                    _.forEach(patch.layers, function (layer) { return layer.init(); });
                    //_.forEach(patch.layers, layer => {
                    //    layer.createPoints();
                    //    layer.createShapes();
                    //    layer.createPSLG();
                    //});
                    // TEST!
                    //_.forEach(patch.layers, (layer, i) => {
                    //    layer._stitches = pattern._stitches[i];
                    //});
                    // TEST
                    deferred.resolve(patch);
                };
                reader.readAsArrayBuffer(file);
                // TEST
                return deferred.promise;
            };
            PatchLoader.prototype.render = function (pattern) {
                _.forEach(pattern._stitches, function (layer) {
                    var canvas = document.createElement("canvas");
                    var context = canvas.getContext("2d");
                    canvas.className = "test-canvas";
                    $("body").append(canvas);
                    canvas.width = pattern.right;
                    canvas.height = pattern.bottom;
                    _.forEach(layer, function (stitch) {
                        if (stitch.flags === Loader.StitchType.Jump ||
                            stitch.flags === Loader.StitchType.Trim ||
                            stitch.flags === Loader.StitchType.Stop) {
                            context.stroke();
                            //const color = pattern.colors[stitch.color];
                            context.beginPath();
                            context.strokeStyle = "black";
                            context.moveTo(stitch.x, stitch.y);
                        }
                        context.lineTo(stitch.x, stitch.y);
                    });
                    context.stroke();
                });
            };
            return PatchLoader;
        }());
        Loader.PatchLoader = PatchLoader;
        module.service("patchLoader", PatchLoader);
    })(Loader = CTP.Loader || (CTP.Loader = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=patch-loader.js.map