var CTP;
(function (CTP) {
    var routes;
    (function (routes) {
        var module = angular.module(CTP.app + ".routes", [
            (CTP.app + ".routes.controlPanel")
        ]);
        function config($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("design", {
                url: "/design",
                template: "<patch-design></patch-design>"
            })
                .state("settings", {
                url: "/settings",
                template: "<patch-settings></patch-settings>"
            });
        }
        module.config(config);
        routes.getModule = function () { return module; };
    })(routes = CTP.routes || (CTP.routes = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=routes.module.js.map