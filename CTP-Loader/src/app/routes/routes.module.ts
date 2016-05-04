namespace CTP.routes {
    
    const module = angular.module(`${app}.routes`, [
        `${app}.routes.controlPanel`
    ]);

    function config($stateProvider: IStateProvider, $urlRouterProvider: IUrlRouterProvider) {

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

    export const getModule = () => module;
}