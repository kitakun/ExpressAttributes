import { ControllerMetaHolder } from './meta/controller.meta';
import { appendControllerToUrl, stringToUrl } from '../utils';

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

    (obj: any): any;
    new(obj: any): any;
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

        const allActions = ControllerMetaHolder.getActions(classInstance);
        for (const act of allActions) {
            if (controllerPrefix) {
                act.action(appendControllerToUrl(controllerPrefix, act.url));
            } else {
                act.action(act.url);
            }
        }

        return classInstance;
    };
}

export { Controller };