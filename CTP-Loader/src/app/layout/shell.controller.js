var CTP;
(function (CTP) {
    var Layout;
    (function (Layout) {
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
        var module = Layout.getModule();
        var ShellController = (function () {
            function ShellController($http, patchLoader) {
                this.$http = $http;
                this.patchLoader = patchLoader;
                this.patch = null;
            }
            ShellController.prototype.loadPatch = function () {
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
            return ShellController;
        }());
        module.controller("ShellController", ShellController);
    })(Layout = CTP.Layout || (CTP.Layout = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=shell.controller.js.map