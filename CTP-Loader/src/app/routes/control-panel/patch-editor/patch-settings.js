var CTP;
(function (CTP) {
    var routes;
    (function (routes) {
        var controlPanel;
        (function (controlPanel) {
            var module = controlPanel.getModule();
            module.component("patchSettings", {
                template: "<h1>Patch Settings</h1>"
            });
        })(controlPanel = routes.controlPanel || (routes.controlPanel = {}));
    })(routes = CTP.routes || (CTP.routes = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=patch-settings.js.map