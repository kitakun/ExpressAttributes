import { ExpressServer } from './decorators';
import './controllers/registeredControllers';

@ExpressServer({
    port: 3000,
    logRoutes: true
})
export class Main {

}