import { Request, Response } from 'express';

import { Controller, Get, Post } from '../decorators';

@Controller({ path: 'test' })
export class TestController {

    @Get()
    public Index(req: Request, res: Response) {
        res.send('test -> Index');
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