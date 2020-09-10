import { Router, NextFunction, Request, Response } from 'express';
// Locals
import { DependencyType } from './type';
import { Injector } from './injector';
import { IControllerInstance } from '../decorators';
import { ActionsMeta, ControllerMeta, IControllerAction } from '../decorators/meta';
import { splitUrlsToRouteInfo } from '../utils';

export const injectControllers = (DI: Injector, allControllers: IControllerInstance[], routes: Router) => {
    routes.use((req: Request, res: Response, next: NextFunction) => {
        let controllerInstance: IControllerInstance;
        let requiredAction: IControllerAction | null = null;

        const [controllerName, actionName] = splitUrlsToRouteInfo(req.url.toLowerCase());

        let controllerType = ControllerMeta.getControllerType(controllerName!);
        if (controllerType && !allControllers.find(f => f.name === controllerType!.name)) { /* try serach in Controllers */ }
        else if (controllerType) {
            controllerInstance = DI.inject(controllerType, DependencyType.controller) as IControllerInstance;
            requiredAction = ActionsMeta.getActionByUrl(controllerInstance, actionName!, req.method.toLowerCase());
        }
        // #2 check that first url is Controller
        if (!requiredAction) {
            controllerType = ControllerMeta.getControllerType(actionName!);
            if (controllerType && allControllers.find(f => f.name === controllerType!.name)) {
                controllerInstance = DI.inject(controllerType, DependencyType.controller) as IControllerInstance;
                requiredAction = ActionsMeta.getActionByUrl(controllerInstance, '/', req.method.toLowerCase());
            }
        }

        if (requiredAction) {
            requiredAction.action.apply(controllerInstance!, [req, res]);
        } else {
            next();
        }
    });
}