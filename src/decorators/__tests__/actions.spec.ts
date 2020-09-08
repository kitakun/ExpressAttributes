import { expect } from 'chai';
import supertest from 'supertest';
import { Request, Response } from 'express';
// Locals
import { Controller } from '../controller.decorator';
import { Get, Post, Delete, Put } from '../action.decorator';

@Controller({ path: 'getme' })
class GetControllerForTests {

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

    before(async function () {
        expressApp = await require('./inject.server').canBeTested;
    });

    // GetControllerForTests

    it('Test @Get Index route binding (not root)', async () => {
        const response = await supertest(expressApp)
            .get('/getme');

        expect(response.status).equal(200);
        expect(response.text).eq(GetControllerForTests.getIndexResponse);
    });

    it('Test @Get by method name route binding (not root)', async () => {
        const response = await supertest(expressApp)
            .get('/getme/byMethodName');

        expect(response.status).equal(200);
        expect(response.text).eq(GetControllerForTests.byMethodNameResponse);
    });

    it('Test @Get by attribute parameter route binding (not root)', async () => {
        const response = await supertest(expressApp)
            .get('/getme/getCustomUrl');

        expect(response.status).equal(200);
        expect(response.text).eq(GetControllerForTests.byByUrlResponse);
    });

    // Index Controller

    it('Test @Get Index route binding (root)', async () => {
        const response = await supertest(expressApp)
            .get('/');

        expect(response.status).equal(200);
        expect(response.text).eq(Index.getIndexResponse);
    });

    it('Test @Get by method name route binding (root)', async () => {
        const response = await supertest(expressApp)
            .get('/byMethodName');

        expect(response.status).equal(200);
        expect(response.text).eq(Index.byMethodNameResponse);
    });

    it('Test @Get by attribute parameter route binding (root)', async () => {
        const response = await supertest(expressApp)
            .get('/getCustomUrl');

        expect(response.status).equal(200);
        expect(response.text).eq(Index.byByUrlResponse);
    });

    // OtherMethods

    it('Test @Post by method and @Controller name route binding', async () => {
        const response = await supertest(expressApp)
            .post('/OtherMethods/postData');

        expect(response.status).equal(200);
        expect(response.text).eq(OtherMethodsController.postRequest1);
    });
    
    it('Test @Put by method and @Controller name route binding', async () => {
        const response = await supertest(expressApp)
            .put('/OtherMethods/put');

        expect(response.status).equal(200);
        expect(response.text).eq(OtherMethodsController.putRequest);
    });
    
    it('Test @Delete by method and @Controller name route binding', async () => {
        const response = await supertest(expressApp)
            .delete('/OtherMethods/del');

        expect(response.status).equal(200);
        expect(response.text).eq(OtherMethodsController.deleteRequest);
    });
});