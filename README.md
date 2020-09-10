# ExpressAttributes
NodeTS on decorators like .NET MVC

## Available decorators
`@Controller` mark class as Controller class

`@Get` mark method as get request handler (same for `@Post @Put @Delete`)

`@ExpressServer` mark class as `Application Entry Point`, create Express server and include all `@Controllers` with `@Get @Post etc`.

`@ExpressServer` create express.js server and configure all routes and DI inside it.

`@Injectable()` mark service for Dependency Injection, without this decorator it's will not be Injectable.

## How to use
 * Wrap your controller with @Controller decorator
 * Wrap API handlers with @Get decorators
 * ???
 * Profit!

## Dependency Injections

Currently it's supports `singletones` and `transients` instances.

For example:

```services.registerSingletone(RootType).As(ChildType);``` after that you can pass RootType `or` ChildType in constructor.

```services.registerSingletone(DataFinale).asObject(new DataFinale({ anyArgs }));``` in this case you can provide singletone instance by yourself.

## @ExpressServer

In `@ExpressServer` can be passed `logRoutes` flag, which will display all routes in console.

Server has 2 overridable methods: ```$registerServices(services: IServiceContainer)``` and ```$onReady(services: IServiceProvider)```.

In `$registerServices` you can register any services that's you will use in future.

In `$onReady` you can configure express instance or load additional configurations into your project.

## Additional

IndexController will be treated as silent root, for example `IndexController` with method `Index` will be routed to `localhost:3000/`

TestController with route `Index` will be routed to `localhost:3000/test`

TestController with route `Hello` will be routed to `localhost:3000/test/hello`

# License
MIT

## What can be additionaly done:
* Implement `Scoped Dependencies`
* Validate duplicate dependencies
* Validate transient injections into singletones
* Controller methods from ```method(req: Request, res:Response)``` to ```methd(@fromQuery() id:number, @fromBody(): data: UserForm): UserAuthResponse```

## PS Additional 

I don't think that's I will continue developing this repo, cause it was just my interest in decorators and inspiration from one guy.