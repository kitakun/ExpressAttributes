import { Request, Response } from 'express';

import { Controller, Get } from '../decorators';

@Controller()
export class IndexController {

    @Get()
    public Index(req: Request, res: Response) {
        res.send('Index -> Index');
    }

    @Get('users')
    getUsers(req: Request, res: Response) {
        res.send('Index -> Users');
    }

    @Get()
    getHello(req: Request, res: Response) {
        res.send('Index -> Hello');
    }
}