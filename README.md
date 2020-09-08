# ExpressAttributes
NodeTS on decorators like .NET MVC

## Available decorators
`@Controller` mark class as Controller class

`@Get` mark method as get request handler (same for `@Post @Put @Delete`)

`@ExpressServer` mark class as `Application Entry Point`, create Express server and include all `@Controllers` with `@Get @Post etc`.

## How to use
 * Wrap your controller with @Controller decorator
 * Wrap API handlers with @Get decorators
 * ???
 * Profit!

## Additional

IndexController will be treated as silent root, for example `IndexController` with method `Index` will be routed to `localhost:3000/`

TestController with route `Index` will be routed to `localhost:3000/test`

TestController with route `Hello` will be routed to `localhost:3000/test/hello`

In `@ExpressServer` can be passed `logRoutes` flag, which will display all routes in console.

# License
MIT