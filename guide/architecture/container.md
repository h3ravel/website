# Service Container

H3ravel’s Service Container is a powerful dependency injection (DI) system that allows you to bind and resolve services, manage singletons, and inject dependencies throughout your application.

## Basic Services Binding

You can register services into the container using the `app.bind()` method. This allows you to register classes, factories, or instances that can be resolved anywhere in the application.

Example

```ts
this.app.bind('app.logger', () => new LoggerService());
```

Now you can resolve it anywhere

```ts
const logger = this.app.make<'app.logger', LoggerService>('app.logger');

logger.log('This is a log message');
```

To avoid conflicts with system-level bindings when registering services to the container, H3ravel requries you to prefix your binding with the `app.` keyword.
Trying to register or resolve a custom service without the `app.` prefix will cause TypeScript to throw an error, ensuring clean separation between framework internals and your own services.

### Benefits

- Prevents naming collisions with system bindings
- Enables type-safe resolution via `app.make<'app.serviceName', ServiceType>()`
- Encourages modular and testable code

Common Example

```ts
// Binding in a service provider
this.app.bind('app.queue', () => new QueueService());

// Resolving it somewhere else
const queue = this.app.make<'app.queue', QueueService>('app.queue');
```

## Singleton Binding

There are times when you want a bound service to always return the same instance, this is where `singletons` come in as they allow your binding to always return the same instance.

```ts
app.singleton(ConfigService, () => {
  return new ConfigService();
});
```

This is great for services that hold state or cache data.

## Automatic Resolution (Controller Injection)

When the container encounters a class type-hint in a controller, it will attempt to auto-resolve it — no manual binding needed if the class has no extra dependencies or can be resolved from other bindings.
In order to use the automatic resolution, you will need to decorate the controller class or the binding method with the `@Injectable()` decorator.

Example

```ts
import { Injectable } from '@h3ravel/core';

@Injectable()
class UserController {
  constructor(private userService: UserService) {}

  async index() {
    return this.userService.all();
  }
}
```

```ts
import { Injectable } from '@h3ravel/core';
import { Request } from '@h3ravel/http';

class UserController {
  @Injectable()
  async index(request: Request) {
    return {
      id: request.input('id'),
    };
  }
}
```

As in the above, if `UserService` is bound or can be autoloaded, it will be injected automatically when the controller is resolved(`Request` is always bound).

## Binding in Service Providers

Service providers are the recommended place to register bindings.

```ts
class AppServiceProvider extends ServiceProvider {
  register() {
    this.app.singleton(UserService, () => new UserService());
  }
}
```

## Resolving

You can resolve anything manually with:

```ts
const userService = app.make(UserService);
```
