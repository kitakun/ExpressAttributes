import { Router, IRouterMatcher } from 'express';
import { ControllerMetaHolder } from './meta/controller.meta';

export const appRouter = Router();

function Get(urlPath?: string) {
    return (classInstance: any, methodName: string, descriptor: PropertyDescriptor) =>
        actionCreator(classInstance, methodName, descriptor, appRouter.get, 'get', urlPath);
}

function Post(urlPath?: string) {
    return (classInstance: any, methodName: string, descriptor: PropertyDescriptor) =>
        actionCreator(classInstance, methodName, descriptor, appRouter.post, 'post', urlPath);
}

function Put(urlPath?: string) {
    return (classInstance: any, methodName: string, descriptor: PropertyDescriptor) =>
        actionCreator(classInstance, methodName, descriptor, appRouter.put, 'put', urlPath);
}

function Delete(urlPath?: string) {
    return (classInstance: any, methodName: string, descriptor: PropertyDescriptor) =>
        actionCreator(classInstance, methodName, descriptor, appRouter.delete, 'delete', urlPath);
}

const actionCreator = function (
    classInstance: any,
    methodName: string,
    descriptor: PropertyDescriptor,
    routs: IRouterMatcher<Router>,
    methodType: string,
    urlPath?: string) {
    const methodUrl = methodName.toLowerCase() === 'index'
        ? '/'
        : urlPath || methodName;
    const apiMethod = classInstance[methodName];

    ControllerMetaHolder.registerAction(classInstance, methodUrl, (url) => {
        ControllerMetaHolder.log(classInstance.constructor.name, methodType, apiMethod.name, url);
        routs.call(appRouter, url, apiMethod)
    });
}

export { Get, Post, Put, Delete };