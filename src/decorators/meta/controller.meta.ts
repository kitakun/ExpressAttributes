import { IControllerInstance } from '..';

declare type registerControllerByUrl = (pathUrl: string) => void;

interface IControllerAction {
    url: string;
    action: registerControllerByUrl;
}

interface IControllerMeta {
    actions: IControllerAction[];
}

export class ControllerMetaHolder {
    public static controllers: Map<IControllerInstance, IControllerMeta> = new Map();

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
}
