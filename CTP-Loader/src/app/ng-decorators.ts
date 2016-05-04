namespace CTP {

    //export function Inject(...dependencies) {
    //    return function decorator(target, key, descriptor) {

    //        if (descriptor) {
    //            const fn = descriptor.value;
    //            fn.$inject = dependencies;
    //        } else {
    //            target.$inject = dependencies;
    //        }
    //    };
    //}

    //export function Component(component) {
    //    return function decorator(target) {
    //        component = component || {};
    //        if (!component.selector) {
    //            throw new Error("@Component() must contain selector property!");
    //        }

    //        if (target.$initView) {
    //            target.$initView(component.selector);
    //        }

    //        target.$isComponent = true;
    //    };
    //}

    //export function View(view) {
    //    let options = view || {};
    //    const defaults = {
    //        template: options.template,
    //        restrict: "E",
    //        scope: {},
    //        bindToController: true,
    //        controllerAs: "vm"
    //    };

    //    return function decorator(target) {
    //        if (target.$isComponent) {
    //            throw new Error("@View() must be placed after @Component()");
    //        }

    //        target.$initView = function(directiveName) {
    //            directiveName = _.camelCase(directiveName);

    //            options.bindToController = options.bindToController || options.bind || {};
    //        }
    //    }
    //}
}