import { Request, Response } from 'express';

import { Controller, Get } from '../decorators';

@Controller({ path: 'test' })
export class TestController {

    @Get()
    public Index(req: Request, res: Response) {
        res.send('test -> Index');
    }

    @Get('users')
    getUsers(req: Request, res: Response) {
        res.send('test -> Users');
    }

    @Get()
    getHello(req: Request, res: Response) {
        res.send('test -> Hello');
    }
}