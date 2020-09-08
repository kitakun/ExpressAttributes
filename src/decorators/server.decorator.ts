import express from 'express';

import { appRouter } from './action.decorator';
import { ControllerMetaHolder } from './meta/controller.meta';

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

export interface IServerInstance {
    express?: Express.Application;
}

/** Make a Node Express Server from this class */
function ExpressServer(decoratorOptions?: IExpressServerOptions | number): Function {
    return (classInstance: IServerInstance) => {
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

        classInstance.express = app;

        return classInstance;
    };
}

export { ExpressServer };