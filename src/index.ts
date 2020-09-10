// inject controllers
import './controllers/registeredControllers';
// inject npm packages
import { Application } from 'express';
// local types
import { ExpressServer } from './decorators';
import { IServiceContainer, IServiceProvider } from './di/type';
import { DataFinale } from './controllers/DataServiceFinal';

@ExpressServer({
    port: 3000,
    logRoutes: true
})
export class Main {
    public $registerServices(services: IServiceContainer) {
        services.registerType(DataFinale);
    }

    public $onReady(services: IServiceProvider) {
        // registered singletone instance
        const server = services.resolve<Application>('express');
    }
}