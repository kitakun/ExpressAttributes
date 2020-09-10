import express, { Router } from 'express';

import { ControllerMeta } from './meta/controller.meta';
import { Injector, IServiceContainer, IServiceProvider } from '../di';
import { ActionsMeta } from './meta';
import { injectControllers } from '../di/controllers.injector';

interface IExpressServerOptions {
    /**
     * Launch Server on selected port
     * Default is 3000
     */
    port?: number;
    /**
     * Write mapped Routes to the console
     */
    logRoutes?: boolean;
}

export interface IServerWrapper {
    prototype: IServerInstance;
}

export interface IServerInstance {
    express?: Express.Application;
    $registerServices?: (services: IServiceContainer) => void;
    $onReady?: (ioc: IServiceProvider) => void;
}

const expressDiKey = 'express';

/** Make a Node Express Server from this class */
function ExpressServer(decoratorOptions?: IExpressServerOptions | number): Function {
    return (classInstance: IServerWrapper) => {
        // Get server port
        let port = Number.isInteger(decoratorOptions)
            ? Number(decoratorOptions)
            : (decoratorOptions as IExpressServerOptions)?.port || 3000;

        const app = express();
        const DI = new Injector();

        // Settup DI
        DI.registerSingletone().asObject(app).byName(expressDiKey);

        if (classInstance.prototype.$registerServices) {
            classInstance.prototype.$registerServices(DI);
        }

        DI.build();

        // Create Controllers
        const routes = Router();
        injectControllers(DI, ControllerMeta.getControllers(), routes);

        // Set routes
        app.use(routes);

        // Start listening
        app.listen(port, () => {
            console.log(`Express Server is running on port ${port}!`);

            // Server is Ready to go
            if (classInstance.prototype.$onReady) {
                classInstance.prototype.$onReady(DI);
            }
        });

        // Print route logs
        if ((decoratorOptions as IExpressServerOptions)?.logRoutes) {
            ActionsMeta.printLogs();
        }

        return classInstance;
    };
}

ExpressServer.expressDiKey = expressDiKey;

export { ExpressServer };