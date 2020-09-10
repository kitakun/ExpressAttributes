import 'reflect-metadata';
// NPMs
import chai, { expect } from 'chai';
// Locals
import { Injector } from '../injector';
import { DateServiceWithDependency, DateServiceWithoutDependency, IDateService, OtherGlobalService } from './services.mocks';

const timeout = (ms: number) => new Promise(res => setTimeout(res, ms))

describe('Dependency Injection', () => {

    var injector: Injector;

    beforeEach(() => {
        injector = new Injector();
    });

    it('check direct singletone registration', async () => {
        // arrange
        injector.registerSingletone(OtherGlobalService);
        injector.build();
        // act
        const globalService = injector.resolve(OtherGlobalService);
        await timeout(100);
        const globalService2 = injector.resolve(OtherGlobalService);
        // assert
        chai.assert.isNotNull(globalService);
        chai.assert.isNotNull(globalService2);
        expect(globalService.getNumber()).eq(globalService2.getNumber());
    });

    it('register singletone Type1 as Type2, recieve both', async () => {
        // arrange
        injector.registerSingletone(DateServiceWithoutDependency).As(IDateService);
        injector.build();
        // act
        const globalService = injector.resolve(DateServiceWithoutDependency);
        const globalService2 = injector.resolve(IDateService);
        // assert
        chai.assert.isNotNull(globalService);
        chai.assert.isNotNull(globalService2);
        expect(globalService).eq(globalService2);
    });

    it('register singletone Type1 by name', async () => {
        // arrange
        injector.registerSingletone(DateServiceWithoutDependency).byName('dateService');
        injector.build();
        // act
        const globalService = injector.resolve<DateServiceWithoutDependency>('dateService');
        // assert
        chai.assert.isNotNull(globalService);
    });

    it('register singletone with inner dependency', async () => {
        // arrange
        injector.registerSingletone(DateServiceWithDependency);
        injector.registerSingletone(OtherGlobalService);
        injector.build();
        // act
        const globalService = injector.resolve(DateServiceWithDependency);
        // assert
        chai.assert.isNotNull(globalService);
        chai.assert.isNotNull(globalService.numbService);
    });
});