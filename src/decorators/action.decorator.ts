import { Router } from 'express';
import { ControllerMetaHolder } from './meta/controller.meta';

export const appRouter = Router();

function Get(urlPath?: string) {
    return (classInstance: any, methodName: string, descriptor: PropertyDescriptor) => {
        const collectionByAction = appRouter.get;
        const methodUrl = methodName.toLowerCase() === 'index'
            ? '/'
            : urlPath || methodName;
        const apiMethod = classInstance[methodName];

        ControllerMetaHolder.registerAction(classInstance, methodUrl, (url) =>
            collectionByAction.call(appRouter, url, apiMethod)
        );
    };
}

export { Get };