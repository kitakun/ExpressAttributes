import { ControllerMeta } from './meta';

interface IOptions {
    /**
     * Request path
     */
    path?: string;
}

export interface IControllerInstance {
    /**
     * Controller name
     */
    name: string;

    new(...obj: any): any;
}

const controllerPostfix = 'controller';

function Controller(decoratorOptions?: IOptions): Function {
    return (classInstance: IControllerInstance) => {

        let controllerPrefix: string;

        if (!decoratorOptions?.path) {
            const controllerUrlPath = classInstance.name.toLowerCase().endsWith(controllerPostfix)
                ? classInstance.name.substr(0, classInstance.name.length - controllerPostfix.length)
                : classInstance.name;

            controllerPrefix = controllerUrlPath;
        } else {
            controllerPrefix = decoratorOptions?.path;
        }

        ControllerMeta.injectController(classInstance, controllerPrefix);

        return classInstance;
    };
}

export { Controller };