# Controllers

Controllers in H3ravel organize your application logic and handle incoming requests.
They receive a fully constructed `HttpContext` object, ensuring consistency and avoiding direct `H3Event` usage.

## Creating a Controller

Controllers are placed in `src/app/Http/Controllers`.

Example: `UserController.ts`

```ts
import { Controller } from "@h3ravel/core";
import { HttpContext } from "@h3ravel/http";

export class UserController extends Controller {
  async index({ request }: HttpContext) {
    return { message: "List of users" };
  }

  async store({ request }: HttpContext) {
    const data = await request.all();
    return { message: "User created", data };
  }

  async show({ request }: HttpContext) {
    return { id: request.params().id, name: "John Doe" };
  }

  async update({ request }: HttpContext) {
    return { message: `User ${request.params().id} updated` };
  }

  async destroy({ request }: HttpContext) {
    return { message: `User ${request.params().id} deleted` };
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
Route.apiResource("users", UserController);
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
