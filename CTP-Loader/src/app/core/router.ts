namespace CTP.Core {

    const module = getModule();

    function run($rootScope: IRootScope) {

        $rootScope.title = "Custom Team Patches";
    }

    module.run(run);
}