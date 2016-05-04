var CTP;
(function (CTP) {
    var routes;
    (function (routes) {
        var controlPanel;
        (function (controlPanel) {
            var module = angular.module(CTP.app + ".routes.controlPanel", []);
            controlPanel.getModule = function () { return module; };
        })(controlPanel = routes.controlPanel || (routes.controlPanel = {}));
    })(routes = CTP.routes || (CTP.routes = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=control-panel.module.js.map