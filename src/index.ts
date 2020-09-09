import 'reflect-metadata';
// inject controllers
import './controllers/registeredControllers';
// inject npm packages
import { Application } from 'express';
import { expect } from 'chai';
// local types
import { ExpressServer } from './decorators';
import { IServiceContainer, IServiceProvider } from './di/type';
import { DateService1, IDateService } from './controllers/services/DateService';

@ExpressServer(3000)
export class Main {
    public $registerServices(services: IServiceContainer) {

        services.registerSingletone(DateService1).As(IDateService).byName('dateService');

    }

    public $onReady(services: IServiceProvider) {
        // registered singletones
        const dt1 = services.resolve(IDateService);
        const dt2 = services.resolve(DateService1);
        const dt3 = services.resolve(DateService1);
        const dt4 = services.resolve<IDateService>('dateService');
        expect(dt1).eq(dt2).eq(dt3).eq(dt4);
        // registered singletone instance
        const server = services.resolve<Application>('express');
    }
}

const server = new Main();