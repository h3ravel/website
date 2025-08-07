# Middleware

In H3ravel, Middlewares allows you to filter and process HTTP requests before they reach your controllers or defined callbacks.
They are similar to Laravel middleware and work seamlessly with `HttpContext`.

## Creating Middleware

Create middleware files in `src/app/Http/Middleware`.

Example: `LogRequests.ts`

```ts
import { HttpContext, Middleware } from "@h3ravel/http";

export class AuthMiddleware extends Middleware {
  async handle(
    { request }: HttpContext,
    next: () => Promise<unknown>
  ): Promise<unknown> {
    console.log("auth middleware", request.getEvent("method"), "request");
    return next();
  }
}
```

## Applying Middleware to Routes

Middleware can be attached to a specific route:

```ts
import { LogRequests } from "App/Http/Middleware/LogRequests";

Route.get("/dashboard", DashboardController).middleware([LogRequests]);
```

## Global Middleware (coming soon)

Global middleware applies to every route.
Define them in the HTTP kernel:

src/app/Http/Kernel.ts

```ts
import { Kernel as HttpKernel } from "@h3ravel/http";
import { LogRequests } from "App/Http/Middleware/LogRequests";

export class Kernel extends HttpKernel {
  protected middleware = [LogRequests];
}
```

## Middleware Execution Flow

- Request hits H3 server
- Kernel applies global middleware
- Route-level middleware is applied
- Controller method executes
- Middleware can modify or short-circuit the response

Example: Authentication Middleware

```ts
import { HttpContext, Middleware } from "@h3ravel/http";

export class AuthMiddleware extends Middleware {
  async handle(
    { request, response }: HttpContext,
    next: () => Promise<unknown>
  ): Promise<unknown> {
    if (!request.headers.get("authorization")) {
      response.setStatusCode(401);
      return { message: "Unauthorized" };
    }

    return await next();
  }
}
```

Usage:

```ts
import { AuthMiddleware } from "App/Http/Middleware/LogRequests";
import { ProfileController } from "App/Http/Controllers/PostController";

Route.get("/profile", [ProfileController, "show"]).middleware([AuthMiddleware]);
```

## Kernel and Pipeline Handling

H3ravel internally uses a `Kernel` class to handle middleware in a pipeline:

- Middleware is executed in order
- Each middleware calls `next()` to pass control
- If `next()` isn’t called, the request stops there
