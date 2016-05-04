var CTP;
(function (CTP) {
    var Core;
    (function (Core) {
        var module = angular.module(CTP.app + ".core", [
            (CTP.app + ".geom"),
            (CTP.app + ".layout"),
            (CTP.app + ".loader"),
            (CTP.app + ".routes"),
            (CTP.app + ".utils"),
        ]);
        Core.getModule = function () { return module; };
    })(Core = CTP.Core || (CTP.Core = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=core.module.js.map