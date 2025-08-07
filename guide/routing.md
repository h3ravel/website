# Routing

H3ravel offers expressive and organized ways to define `web` and `API` routes.
Routes are defined in the `src/routes` directory and automatically loaded by the framework during application boot.

## Basic Examples

Define routes in `src/routes/web.ts`:

```ts
import { Router } from "@h3ravel/router";
import { HomeController } from "App/Http/Controllers/HomeController";
import { PostController } from "App/Http/Controllers/PostController";

export default (Route: Router) => {
  Route.get("/", HomeController, "index");
  Route.get("/posts", PostController, "index");
};
```

Define routes in `src/routes/api.ts`:

```ts
import { Router } from "@h3ravel/router";
import { UserController } from "App/Http/Controllers/UserController";
import { HomeController } from "App/Http/Controllers/HomeController";
import { PostController } from "App/Http/Controllers/PostController";

export default (Route: Router) => {
  Route.get("/", HomeController, "index");
  Route.apiResource("/users", UserController);
  Route.apiResource("/posts", PostController);
};
```

## Supported HTTP Verbs

- Route.get(path, handler)
- Route.post(path, handler)
- Route.put(path, handler)
- Route.patch(path, handler)
- Route.delete(path, handler)
- Route.options(path, handler)

## Route Parameters

H3ravel supports dynamic route parameters:

```ts
Route.get("/users/:id", [UserController, "show"]);
```

The parameter `id` is automatically available in your controller:

```ts
import { HttpContext } from "@h3ravel/http";

export class UserController {
  async show({ request }: HttpContext) {
    return {
      id: request.params().id,
    };
  }
}
```

## Named Routes

You can assign names to routes for generating URLs later:

```ts
Route.get("/dashboard", [DashboardController, "index"])->name("dashboard");
```

When you define a named route, you can access it by calling `Route.url('name')`

```ts
import { Router } from "@h3ravel/router";

console.log(Router.url("dashboard")); // /dashboard
```

## Route Callbacks

Not only can Routes target controller actions, they can also recieve callbacks that will be executed on demand.

```ts
import { HttpContext } from "@h3ravel/http";

Route.get("/webhook", ({ request }: HttpContext) => {
  return {
    message: "Request was successfull",
    data: request.all(),
  };
});
```

## Middleware

Middleware can be applied to routes:

```ts
import { AuthMiddleware } from "App/Http/Middleware/AuthMiddleware";

Route.get("/profile", [ProfileController, "index"]).middleware([
  AuthMiddleware,
]);
```

## Route Groups

Group routes under a common prefix and middleware:

```ts
Route.group({ prefix: "/admin", middleware: [AuthMiddleware] }, () => {
  Route.get("/users", [AdminUserController, "index"]);
  Route.get("/settings", [SettingsController, "index"]);
});
```

## API Resource Routes

Define RESTful API endpoints automatically:

```ts
Route.apiResource("users", UserController);
```

This generates:

| Method | URI        | Action  |
| ------ | ---------- | ------- |
| GET    | /users     | index   |
| POST   | /users     | store   |
| GET    | /users/:id | show    |
| PUT    | /users/:id | update  |
| DELETE | /users/:id | destroy |

## Loading Routes

H3ravel automatically scans and loads routes from:

- `src/routes/web.ts`: Web routes
- `src/routes/api.ts`: API routes
