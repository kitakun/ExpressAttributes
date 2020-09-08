import { IControllerInstance } from '..';

declare type registerControllerByUrl = (pathUrl: string) => void;

interface IControllerAction {
    url: string;
    action: registerControllerByUrl;
}

interface IControllerMeta {
    actions: IControllerAction[];
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export class ControllerMetaHolder {
    private static controllers: Map<IControllerInstance, IControllerMeta> = new Map();
    private static _logs: string[] = [];

    private static getOrCreateMeta(controller: IControllerInstance): IControllerMeta {
        let meta: IControllerMeta;
        if (!ControllerMetaHolder.controllers.has(controller)) {
            meta = {
                actions: []
            };
            ControllerMetaHolder.controllers.set(controller, meta);
        } else {
            meta = ControllerMetaHolder.controllers.get(controller) as IControllerMeta;
        }
        return meta;
    }

    public static registerAction(controller: IControllerInstance, url: string, action: registerControllerByUrl): void {
        const meta = ControllerMetaHolder.getOrCreateMeta(controller);
        meta.actions.push({
            action: action,
            url: url
        });
    }

    public static getActions(controller: IControllerInstance): IControllerAction[] {
        return ControllerMetaHolder.getOrCreateMeta(controller.prototype).actions;
    }

    public static log(controller: string, requestType: string, methodName: string, url: string): void {
        ControllerMetaHolder._logs.push(`\x1b[32m${controller}\x1b[0m -> [${capitalizeFirstLetter(requestType)}] \x1b[32m${methodName}\x1b[0m -> \x1b[33m${url}\x1b[0m`);
    }
    public static printLogs(): void {
        for (const logData of ControllerMetaHolder._logs) {
            console.log(logData);
        }
    }
    public static clearLogs(): void {
        ControllerMetaHolder._logs = [];
    }
}
