import { IControllerInstance } from '..';
import { Router } from 'express';
import { ControllerMeta } from './controller.meta';

declare type registerControllerByUrl = (pathUrl: string, context: any, appRouter: Router) => void;

export interface IControllerAction {
    url: string;
    method: string;
    controller: IControllerInstance;
    action: (...args: any) => void;
}

interface IControllerMeta {
    actions: IControllerAction[];
}

export class ActionsMeta {

    private static controllers: Map<Function, IControllerMeta> = new Map();

    private static getOrCreateMeta(controller: IControllerInstance): IControllerMeta {
        let meta: IControllerMeta;
        const key = controller.constructor;
        if (!ActionsMeta.controllers.has(key)) {
            meta = {
                actions: []
            };
            ActionsMeta.controllers.set(key, meta);
        } else {
            meta = ActionsMeta.controllers.get(key) as IControllerMeta;
        }
        return meta;
    }

    // Actions cache

    public static registerAction(controller: IControllerInstance, url: string, method: string, action: registerControllerByUrl): void {
        const meta = ActionsMeta.getOrCreateMeta(controller);
        meta.actions.push({
            action: action,
            method: method,
            controller: controller,
            url: url
        });
    }

    public static getActionByUrl(controller: IControllerInstance, url: string, method: string): IControllerAction | null {
        const allActions = ActionsMeta.controllers.get(controller.constructor);
        return allActions?.actions.find(f => f.url.toLowerCase() === url && f.method === method) || null;
    }

    public static printLogs(): void {

        function capitalizeFirstLetter(string: string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function toLogUrl(string: string) {
            if (!string.startsWith('/')) {
                return `/${string}`;
            }
            return string;
        }

        for (const controllerMeta of ActionsMeta.controllers) {
            for (const controllerAction of controllerMeta[1].actions) {
                let ctrlName = ControllerMeta.getControllerName(controllerAction.controller.constructor as any);
                ctrlName = ctrlName === 'Index'
                    ? ''
                    : `/${ctrlName}`;
                console.log(`\x1b[32m${controllerAction.controller.constructor.name}\x1b[0m -> [${capitalizeFirstLetter(controllerAction.method)}] \x1b[32m${controllerAction.action.name}\x1b[0m -> \x1b[33m${ctrlName + toLogUrl(controllerAction.url)}\x1b[0m`);
            }
        }
    }
}
