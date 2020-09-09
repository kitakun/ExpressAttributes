import express from 'express';

import { appRouter } from './action.decorator';
import { ControllerMetaHolder } from './meta/controller.meta';
import { Injector, IServiceContainer, IServiceProvider } from '../di';

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
        const app = express();

        // Get routes
        app.use(appRouter);

        // Get server port
        let port = Number.isInteger(decoratorOptions)
            ? Number(decoratorOptions)
            : (decoratorOptions as IExpressServerOptions)?.port || 3000;

        // Enable/Disable route logs
        if ((decoratorOptions as IExpressServerOptions)?.logRoutes) {
            ControllerMetaHolder.printLogs();
        } else {
            ControllerMetaHolder.clearLogs();
        }

        // Start listening
        app.listen(port, () => {
            console.log(`Express Server is running on port ${port}!`);
        });

        classInstance.prototype.express = app;

        const DI = new Injector();

        DI.registerSingletone().asObject(app).byName(expressDiKey);

        if (classInstance.prototype.$registerServices) {
            classInstance.prototype.$registerServices(DI);
        }

        DI.build();

        if (classInstance.prototype.$onReady) {
            classInstance.prototype.$onReady(DI);
        }

        return classInstance;
    };
}

ExpressServer.expressDiKey = expressDiKey;

export { ExpressServer };