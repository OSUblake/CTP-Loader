var CTP;
(function (CTP) {
    CTP.app = "customTeamPatches";
    var module = angular.module(CTP.app, [
        "ui.router",
        "ngMaterial",
        (CTP.app + ".core")
    ]);
    CTP.getModule = function () { return module; };
})(CTP || (CTP = {}));
//# sourceMappingURL=app.module.js.map