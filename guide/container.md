# Service Container

H3ravel’s Service Container is a powerful dependency injection (DI) system that allows you to bind and resolve services, manage singletons, and inject dependencies throughout your application.

## Binding Services

You can register services into the container using the `app.bind()` method. This allows you to register classes, factories, or instances that can be resolved anywhere in the application.

Example

```ts
this.app.bind("app.logger", () => new LoggerService());
```

Now you can resolve it anywhere

```ts
const logger = this.app.make<"app.logger", LoggerService>("app.logger");

logger.log("This is a log message");
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
this.app.bind("app.queue", () => new QueueService());

// Resolving it somewhere else
const queue = this.app.make<"app.queue", QueueService>("app.queue");
```

This structure helps maintain clarity between system-level and user-defined bindings while keeping your application flexible and type-safe.
