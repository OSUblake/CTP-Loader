var CTP;
(function (CTP) {
    var routes;
    (function (routes) {
        var controlPanel;
        (function (controlPanel) {
            var module = controlPanel.getModule();
            var patches = [
                "ohio 4in.DST",
                "A06inch.DST",
                "B.DST",
                "football border.DST",
                "football.DST",
                "GONZAGA.DST",
                "leprechaun 5in.DST",
                "O 5 INCH.DST",
                "ohio 4in.DST",
                "ohio state border.DST" // 9
            ].map(function (patch) { return ("patches/" + patch); });
            var PatchDesign = (function () {
                function PatchDesign($http, patchLoader) {
                    this.$http = $http;
                    this.patchLoader = patchLoader;
                    this.patch = null;
                }
                PatchDesign.prototype.editShape = function (shape, layer) {
                    this.currentShape = shape;
                    this.currentLayer = layer;
                };
                PatchDesign.prototype.updateLayer = function () {
                    this.currentLayer.updateShape();
                };
                PatchDesign.prototype.loadPatch = function () {
                    var _this = this;
                    this.patch = null;
                    this.$http({
                        method: "GET",
                        url: patches[6],
                        responseType: "arraybuffer"
                    }).then(function (response) {
                        _this.patchLoader
                            .createPatch(new Blob([response.data]))
                            .then(function (response) {
                            _this.patch = response;
                            console.log("PATCH LOADED\n", _this.patch);
                        }, function (reponse) { return console.error("Load patch", response.data || "Request failed"); });
                    }, function (response) {
                        console.error("Load patch", response.data || "Request failed");
                    });
                };
                return PatchDesign;
            }());
            module.controller("PatchDesign", PatchDesign);
            module.component("patchDesign", {
                //template: "<h1>Patch Design</h1>",
                templateUrl: "app/routes/control-panel/patch-editor/patch-design.html",
                controller: "PatchDesign"
            });
        })(controlPanel = routes.controlPanel || (routes.controlPanel = {}));
    })(routes = CTP.routes || (CTP.routes = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=patch-design.js.map