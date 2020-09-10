import { ActionsMeta } from './meta';

function Get(urlPath?: string) {
    return (classInstance: any, methodName: string, _: PropertyDescriptor) =>
        actionCreator(classInstance, methodName, 'get', urlPath);
}

function Post(urlPath?: string) {
    return (classInstance: any, methodName: string, _: PropertyDescriptor) =>
        actionCreator(classInstance, methodName, 'post', urlPath);
}

function Put(urlPath?: string) {
    return (classInstance: any, methodName: string, _: PropertyDescriptor) =>
        actionCreator(classInstance, methodName, 'put', urlPath);
}

function Delete(urlPath?: string) {
    return (classInstance: any, methodName: string, _: PropertyDescriptor) =>
        actionCreator(classInstance, methodName, 'delete', urlPath);
}

const actionCreator = function (
    classInstance: any,
    methodName: string,
    methodType: string,
    urlPath?: string) {
    const methodUrl = methodName.toLowerCase() === 'index'
        ? '/'
        : urlPath || methodName;
    const apiMethod = classInstance[methodName];

    ActionsMeta.registerAction(classInstance, methodUrl, methodType, apiMethod);
}

export { Get, Post, Put, Delete };