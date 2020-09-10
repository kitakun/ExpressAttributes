import 'reflect-metadata';
// Locals
import { Type } from '../../di';
import { IControllerInstance } from '../';

export class ControllerMeta {

    // Controllers injection cache
    private static _requiredInjections: Map<Type<any>, Type<any>[]> = new Map();
    private static _controllerNames: Map<Type<any>, string> = new Map();

    public static getControllerType(typeName: string): Type<any> | null {
        const lookForController = typeName.toLowerCase();
        for (const pair of ControllerMeta._controllerNames) {
            if (pair[1].toLowerCase() === lookForController) {
                return pair[0];
            }
        }
        
        return null;
    }

    public static getControllerName(controller: IControllerInstance): string {
        return ControllerMeta._controllerNames.get(controller)!;
    }

    public static getControllers(): IControllerInstance[] {
        return Array.from(this._controllerNames.keys() as any);
    }

    public static injectController(controller: IControllerInstance, controllerUrlName: string) {
        ControllerMeta._controllerNames.set(controller, controllerUrlName);
        const requiredParams = Reflect.getMetadata('design:paramtypes', controller) || [];
        if (requiredParams.length > 0) {
            this._requiredInjections.set(controller, requiredParams);
        }
    }
}
