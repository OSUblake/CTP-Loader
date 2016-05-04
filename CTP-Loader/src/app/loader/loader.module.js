var CTP;
(function (CTP) {
    var Loader;
    (function (Loader) {
        var module = angular.module(CTP.app + ".loader", []);
        Loader.getModule = function () { return module; };
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
        function seedSamples($http, patchLoader) {
            // TEST
            var patch;
            $http({
                method: "GET",
                url: patches[6],
                responseType: "arraybuffer"
            }).then(function (response) {
                patchLoader.createPatch(new Blob([response.data]))
                    .then(function (response) {
                    patch = response;
                    console.log("PATCH LOADED\n", patch);
                });
            }, 
            //response => patchLoader.createPatch(new Blob([response.data])),
            function (response) { return console.error("Load patch", response.data || "Request failed"); });
            //response => logger.error("Load patch", response.data || "Request failed"));
        }
    })(Loader = CTP.Loader || (CTP.Loader = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=loader.module.js.map