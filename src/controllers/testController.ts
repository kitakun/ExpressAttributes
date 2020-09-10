import { Request, Response } from 'express';

import { Controller, Get, Post } from '../decorators';
import { DataFinale } from './DataServiceFinal';

@Controller({ path: 'test' })
export class TestController {

    constructor(
        private readonly service: DataFinale) {
    }

    @Get()
    public Index(req: Request, res: Response) {
        res.send(`test -> Index -> service=${this.service.getNumber()}`);
    }

    @Get('users')
    public getUsers(req: Request, res: Response) {
        res.send('test -> Users');
    }

    @Get()
    public getHello(req: Request, res: Response) {
        res.send('test -> Hello');
    }

    @Post('index')
    public postIndex(req: Request, res: Response) {
        res.send('test -> post Index');
    }

    @Post()
    public postTest(req: Request, res: Response) {
        res.send('test -> postTest');
    }

    @Post('postme')
    public postTest2(req: Request, res: Response) {
        res.send('test -> postme');
    }
}