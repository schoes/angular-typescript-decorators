import * as _ from "lodash";
import * as angular from "angular";

function _getModule(moduleName: string): angular.IModule {
    let module: angular.IModule;
    try {
        console.log('module found', moduleName);
        module = angular.module(moduleName);
    } catch (err) {
        console.error('module not found', moduleName, 'create a new one');
        module = angular.module(moduleName, []);
    }
    return module;
}

export interface ModuleOptions {
    module: string;
}

export interface ComponentOptions extends angular.IComponentOptions,ModuleOptions {
    selector: string;
    styles?: string;
}
export const Component = (options: ComponentOptions): Function => {

    return (controller: Function) => {
        let component: ComponentOptions = _.assign(options, {controller});
        if (typeof angular !== 'undefined') {
            _getModule(component.module)
                .component(getComponentNameFromSelector(component), component);
        }
        return controller;
    };

    function getComponentNameFromSelector(component: ComponentOptions): string {
        return _.camelCase(component.selector);
    }
};

export interface ServiceOptions extends ModuleOptions {
    serviceName: string;
}
export const Service = (options: ServiceOptions): Function => {
    return (service: Function) => {
        if (typeof angular !== 'undefined') {
            _getModule(options.module)
                .service(options.serviceName, service);
        }
        return service;
    };
};

export interface FilterOptions extends ModuleOptions {
    filterName: string;
}
export const Filter = (options: FilterOptions) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (typeof angular !== 'undefined') {
            _getModule(options.module)
                .filter(options.filterName, descriptor.value);
        }
        return descriptor.value;
    };
};

export const Config = (options: ModuleOptions) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (typeof angular !== 'undefined') {
            _getModule(options.module)
                .config(descriptor.value);
        }
        return descriptor.value;
    };
};


export const Run = (options: ModuleOptions) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (typeof angular !== 'undefined') {
            _getModule(options.module)
                .run(descriptor.value);
        }
        return descriptor.value;
    };
};