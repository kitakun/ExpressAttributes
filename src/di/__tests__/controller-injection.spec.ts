import 'reflect-metadata';
// NPMs
import { Request, Response, Router } from 'express';
import supertest from 'supertest';
import { expect } from 'chai';
// Locals
import { Injector } from '../injector';
import { Controller, Get, Injectable } from '../../decorators';
import { injectControllers } from '../controllers.injector';
// Utils
import { canBeTested } from '../../utils/__tests__/inject.server';
import { TestDateService, TransientTestService } from './services.mocks';

@Controller()
class DateController {

    public static initialValue = 1;

    constructor(
        public readonly dateService: TestDateService,
        public readonly transientServie: TransientTestService) {
    }

    @Get()
    getCurrentDate(req: Request, res: Response) {
        res.send(this.dateService.getDate().toString());
    }

    @Get()
    changeContext(req: Request, res: Response) {
        DateController.initialValue++;
        res.send('ok');
    }

    @Get()
    recieveFromContext(req: Request, res: Response) {
        res.send(DateController.initialValue.toString());
    }

    @Get()
    transientContext(req: Request, res: Response) {
        res.send(this.transientServie.getDate().toString());
    }
}

describe('Controller Injection', () => {

    var injector: Injector;
    var expressApp: Express.Application;
    var expressRouter: Router;

    beforeEach(async () => {
        [expressApp, expressRouter] = await canBeTested('Controller Injection', [DateController]);
        injector = new Injector();
        injector.registerSingletone(TestDateService);
        injector.registerType(TransientTestService);
        injector.build();
        injectControllers(injector, [DateController], expressRouter);
    });

    it('register singletone with inner dependency', async () => {
        // act
        const response = await supertest(expressApp)
            .get('/Date/getCurrentDate');

        // assert
        expect(response.status).equal(200);
        expect(response.text).eq(TestDateService.staticDate.toString());
    });

    it('register transient service, test thats data will be changed', async () => {
        // act
        const response1 = await supertest(expressApp)
            .get('/Date/transientContext');

        // act
        const response2 = await supertest(expressApp)
            .get('/Date/transientContext');

        // assert
        expect(response1.status).equal(200);
        expect(response1.text.length).greaterThan(0);
        expect(response2.status).equal(200);
        expect(response2.text.length).greaterThan(0);
        expect(response2.text).not.eq(response1.text);
    });
});


describe('Controller context', () => {

    var injector: Injector;
    var expressApp: Express.Application;
    var expressRoutes: Router;

    beforeEach(async () => {
        [expressApp, expressRoutes] = await canBeTested('Controller context', [DateController]);
        injector = new Injector();
    });

    it('test context between different requests', async () => {
        // arrange
        injector.registerSingletone(TestDateService);
        injector.build();
        injectControllers(injector, [DateController], expressRoutes);

        // act
        const response1 = await supertest(expressApp)
            .get('/Date/changeContext');
        const response2 = await supertest(expressApp)
            .get('/Date/recieveFromContext');

        // assert
        expect(response1.status).equal(200);
        expect(response1.text).eq('ok');
        expect(response2.status).equal(200);
        expect(response2.text).eq('2');
    });
});