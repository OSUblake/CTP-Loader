namespace CTP {

    export const app = "customTeamPatches";

    const module = angular.module(app, [
        "ui.router",
        "ngMaterial",
        `${app}.core`
    ]);

    export const getModule = () => module;
}