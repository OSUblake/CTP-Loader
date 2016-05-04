namespace CTP.Core {

    const module = angular.module(`${app}.core`, [
        `${app}.geom`,
        `${app}.layout`,
        `${app}.loader`,
        `${app}.routes`,
        `${app}.utils`,
    ]);

    export const getModule = () => module;
}