import { expect } from 'chai';
import supertest from 'supertest';
import { Request, Response, Router } from 'express';
// Locals
import { Controller } from '../controller.decorator';
import { Get, Post, Delete, Put } from '../action.decorator';
import { Injector } from '../../di';
import { injectControllers } from '../../di/controllers.injector';
// Test Utils
import { canBeTested } from '../../utils/__tests__/inject.server';


@Controller({ path: 'getme' })
class GetControllerForTests {

    isIhaveIt = 5;
    orNot: string;
    constructor() {
        this.orNot = 'you have';
    }

    static getIndexResponse = 'getme/indexget';
    @Get()
    index(req: Request, res: Response) {
        res.send(GetControllerForTests.getIndexResponse);
    }

    static byMethodNameResponse = 'getme/byMethodName';
    @Get()
    byMethodName(req: Request, res: Response) {
        res.send(GetControllerForTests.byMethodNameResponse);
    }

    static byByUrlResponse = 'getme/getCustomUrl';
    @Get('getCustomUrl')
    getByUrl(req: Request, res: Response) {
        res.send(GetControllerForTests.byByUrlResponse);
    }
}

@Controller()
class Index {

    static getIndexResponse = 'root/index';
    @Get()
    index(req: Request, res: Response) {
        res.send(Index.getIndexResponse);
    }

    static byMethodNameResponse = 'root/byMethodName';
    @Get()
    byMethodName(req: Request, res: Response) {
        res.send(Index.byMethodNameResponse);
    }

    static byByUrlResponse = 'root/getCustomUrl';
    @Get('getCustomUrl')
    getByUrl(req: Request, res: Response) {
        res.send(Index.byByUrlResponse);
    }
}

@Controller()
class OtherMethodsController {

    static postRequest1 = 'otherMethods -> postData'
    @Post('postData')
    public method1(req: Request, res: Response) {
        res.send(OtherMethodsController.postRequest1);
    }

    static deleteRequest = 'otherMethods -> delete'
    @Delete('del')
    public method2(req: Request, res: Response) {
        res.send(OtherMethodsController.deleteRequest);
    }

    static putRequest = 'otherMethods -> put?'
    @Put('put')
    public method3(req: Request, res: Response) {
        res.send(OtherMethodsController.putRequest);
    }
}

describe('Action Decorators Tests', () => {

    let expressApp: Express.Application;
    let expressRoutes: Router;

    beforeEach(async function () {
        const [app, routes] = await canBeTested('Action Decorators Tests', [Index, OtherMethodsController, GetControllerForTests]);
        expressApp = app;
        expressRoutes = routes;
    });

    // GetControllerForTests

    it('Test @Get Index route binding (not root)', async () => {
        // Assert
        injectControllers(new Injector(), [GetControllerForTests], expressRoutes);

        // Act
        const response = await supertest(expressApp)
            .get('/getme');

        // Arrange
        expect(response.status).equal(200);
        expect(response.text).eq(GetControllerForTests.getIndexResponse);
    });

    it('Test @Get by method name route binding (not root)', async () => {
        // Assert
        injectControllers(new Injector(), [GetControllerForTests], expressRoutes);

        // Act
        const response = await supertest(expressApp)
            .get('/getme/byMethodName');

        // Arrange
        expect(response.status).equal(200);
        expect(response.text).eq(GetControllerForTests.byMethodNameResponse);
    });

    it('Test @Get by attribute parameter route binding (not root)', async () => {
        // Assert
        injectControllers(new Injector(), [GetControllerForTests], expressRoutes);

        // Act
        const response = await supertest(expressApp)
            .get('/getme/getCustomUrl');

        // Arrange
        expect(response.status).equal(200);
        expect(response.text).eq(GetControllerForTests.byByUrlResponse);
    });

    // Index Controller

    it('Test @Get Index route binding (root)', async () => {
        // Assert
        injectControllers(new Injector(), [Index], expressRoutes);

        // Act
        const response = await supertest(expressApp)
            .get('/');

        // Arrange
        expect(response.status).equal(200);
        expect(response.text).eq(Index.getIndexResponse);
    });

    it('Test @Get by method name route binding (root)', async () => {
        // Assert
        injectControllers(new Injector(), [Index], expressRoutes);

        // Act
        const response = await supertest(expressApp)
            .get('/byMethodName');

        // Arrange
        expect(response.status).equal(200);
        expect(response.text).eq(Index.byMethodNameResponse);
    });

    it('Test @Get by attribute parameter route binding (root)', async () => {
        // Assert
        injectControllers(new Injector(), [Index], expressRoutes);

        // Act
        const response = await supertest(expressApp)
            .get('/getCustomUrl');

        // Arrange
        expect(response.status).equal(200);
        expect(response.text).eq(Index.byByUrlResponse);
    });

    // OtherMethods

    it('Test @Post by method and @Controller name route binding', async () => {
        // Assert
        injectControllers(new Injector(), [OtherMethodsController], expressRoutes);

        // Act
        const response = await supertest(expressApp)
            .post('/OtherMethods/postData');

        // Arrange
        expect(response.status).equal(200);
        expect(response.text).eq(OtherMethodsController.postRequest1);
    });

    it('Test @Put by method and @Controller name route binding', async () => {
        // Assert
        injectControllers(new Injector(), [OtherMethodsController], expressRoutes);

        // Act
        const response = await supertest(expressApp)
            .put('/OtherMethods/put');

        // Arrange
        expect(response.status).equal(200);
        expect(response.text).eq(OtherMethodsController.putRequest);
    });

    it('Test @Delete by method and @Controller name route binding', async () => {
        // Assert
        injectControllers(new Injector(), [OtherMethodsController], expressRoutes);

        // Act
        const response = await supertest(expressApp)
            .delete('/OtherMethods/del');

        // Arrange
        expect(response.status).equal(200);
        expect(response.text).eq(OtherMethodsController.deleteRequest);
    });
});