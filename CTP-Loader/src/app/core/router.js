var CTP;
(function (CTP) {
    var Core;
    (function (Core) {
        var module = Core.getModule();
        function run($rootScope) {
            $rootScope.title = "Custom Team Patches";
        }
        module.run(run);
    })(Core = CTP.Core || (CTP.Core = {}));
})(CTP || (CTP = {}));
//# sourceMappingURL=router.js.map