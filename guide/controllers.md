# Controllers

Controllers in H3ravel organize your application logic and handle incoming requests.
They receive a fully constructed `HttpContext` object, ensuring consistency and avoiding direct `H3Event` usage.

We could define all our request handling logic directly as closures within our route definitions, but where's the fun there when we can have them in dedicated `controller` classes for better structure and organization. Controllers allow you to consolidate related HTTP request logic into one cohesive class. Think of a `UserController` that manages every user-related action, from displaying profiles and creating new accounts to updating details and handling deletions. In H3ravel, these controllers are placed in `src/app/Http/Controllers` by default, keeping our codebase clean and scalable.

## Creating a Controller

To whip up a new controller, run the `make:controller` Musket command. By default H3ravel will store all your app's controllers in the `src/app/Http/Controllers` directory:

```sh
$ npx musket make:controller UserController
```

Let's look at the structure of a basic controller. A controller may have several public methods which will respond to all incoming HTTP requests:

Example: `UserController.ts`

```ts
import { Controller } from '@h3ravel/core';
import { HttpContext } from '@h3ravel/http';
import User from 'App/Models/user';

export class UserController extends Controller {
  async show(user: User) {
    return await view('profile', {
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  }
}
```

## HttpContext

Instead of directly working with `H3Event`, H3ravel injects a custom `HttpContext` object with:

- `request`: Access query params, body, headers, files
- `response`: Customize response status, headers, cookies

Example:

```ts
async index({ request, response }: HttpContext) {
  const page = request.query.page
  response.status(200)
  return { message: `You are on page ${page}` }
}
```

## Returning Responses

You don’t need `res.send` or `res.json`.
Simply returning a value from your controller method is all you need:

```ts
return { message: 'Success' }`
```

This automatically becomes the HTTP response.

## Controller + API Resource Routes

When you use `Route.apiResource`, it automatically maps RESTful routes to controller methods:

```ts
Route.apiResource('users', UserController);
```

This route definition expects the `UserController` to have these methods:

- `index`
- `store`
- `show`
- `update`
- `destroy`

## Constructor Injection (coming soon)

Controllers can receive services via constructor injection:

```ts
export class ProfileController extends Controller {
  constructor(private userService: UserService) {
    super();
  }

  async index({ request }: HttpContext) {
    return this.userService.getProfile();
  }
}
```
