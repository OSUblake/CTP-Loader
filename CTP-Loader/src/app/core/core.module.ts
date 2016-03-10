namespace CTP.Core {

    const module = angular.module(`${app}.core`, [
        `${app}.layout`,
        `${app}.loader`,
    ]);

    export const getModule = () => module;
}