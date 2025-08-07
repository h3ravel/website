# Service Providers

Service providers are the central place of all H3ravel application bootstrapping.
They handle the registration of bindings into the service container and can optionally perform additional boot logic.

H3ravel uses service providers to bootstrap services like Config, HTTP, Routing and they are typically stored in the `src/app/Providers` directory.

## Creating a Service Provider

To create a provider, extend the `ServiceProvider` class:

```ts
import { ServiceProvider } from "@h3ravel/core";

export class MyServiceProvider extends ServiceProvider {
  public static priority: number = 20;
  public static order?: `before:${string}` | `after:${string}` | string;

  register(): void {
    // Bind a service to the container
    this.app.bind("myService", () => new MyService());
  }

  boot(): void {
    const service = this.app.make<MyService>("myService");
    service.initialize();
  }
}
```

- `register()`: Register services into the container.
- `boot()`: Runs after all providers have been registered.
- `order`: A static runtime property for ordering providers.
- `priority`: → A static runtime property that also controls load order.

## Registering a Service Provider

Service Providers are loaded in `bootstrap/providers.ts`

```ts
import { Application } from "@h3ravel/core";
import { IServiceProvider } from "@h3ravel/shared";
import { MyServiceProvider } from "App/Providers/MyServiceProvider";

export default <Array<new (_app: Application) => IServiceProvider>>[
  // ... other service providers
  MyServiceProvider,
  // ... other service providers
];
```

## Service Provider Ordering

There are two ways to influence the service provider load order:

### The Priority Property

The Priority Property is A static numeric property used to define importance-based ordering.

- Default: 0
- Behavior: Providers with higher priority load before lower priority ones.
- Use Case: Great for core services that must initialize first (e.g., `Config`, `Http`).

Example:

```ts
export class ConfigProvider extends ServiceProvider {
  public static priority = 100; // loads early
}

export class CacheProvider extends ServiceProvider {
  public static priority = 10; // loads later
}
```

Load order:

1. ConfigProvider
2. CacheProvider

> **Note** - Default service providers have a priority ranging from `999`-`990`
> We recommend leaving the `900` range for the default service providers.

### The Order Property

The `order` property allows fine-grained ordering of providers beyond just numeric priority.

- `before:ProviderName`: Ensures this provider is loaded before another.
- `after:ProviderName`: Ensures this provider is loaded after another.
- `string` → Used as a named grouping for ordering.
- `undefined`: Defaults to normal registration order.

Example:

```ts
export class LoggingProvider extends ServiceProvider {
  public static order = "before:CacheProvider";
}

export class CacheProvider extends ServiceProvider {
  public static order = "after:LoggingProvider";
}

export class AuthProvider extends ServiceProvider {
  public static order = "security";
}
```

Even if registered like:

```ts
export default <Array<new (_app: Application) => IServiceProvider>>[
  AuthProvider,
  CacheProvider,
  LoggingProvider,
];
```

The final resolved load order will be:

- `LoggingProvider` (loads before `CacheProvider`)
- `CacheProvider` (loads after `LoggingProvider`)
- `AuthProvider` (no dependency, remains in its slot)

### Combined Ordering

When multiple providers have ordering dependencies:

- H3ravel uses a topological sort to determine the correct load order.
- Circular dependencies will throw an error.
- If both `order` and numeric `priority` exist, `order` takes precedence.
