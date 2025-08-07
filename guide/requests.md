# HTTP Request

The Request class in H3ravel provides a clean interface for working with incoming HTTP requests. It wraps H3’s `H3Event` and adds convenient helpers to access `input`, `query` parameters, `route` parameters, and `headers`.

## Overview

- Access all input data at once
- Retrieve a single field using `input()`
- Work with query strings and route params
- Get request headers with type safety
- Access the underlying H3 event if needed

## Available Methods

### `all()`

Gets all input data, including query parameters, body fields, and route parameters.

```ts
const data = await request.all();
// Example: { name: 'John', page: 2 }
```

### `input(key, defaultValue?)`

Gets a single input field from the query or body.
You can specify a default value if the key is missing.

```ts
const name = await request.input("name", "Guest");
// 'John' or 'Guest' if not found
```

### `params`

Returns the route parameters of the current request.

```ts
const { id } = request.params;
// For /users/:id => { id: '123' }
```

### `query`

Returns the query parameters as an object.

```ts
const search = request.query.search;
// For /search?search=books => 'books'
```

### `headers`

Retrieves the request headers with typed support.

```ts
const contentType = request.headers("content-type");
```

### `getEvent()`

Gets the underlying `H3Event` object for advanced use cases.

## Example Usage

```ts
import { Controller, HttpContext } from "@h3ravel/core";

export class UserController extends Controller {
  async store({ request }: HttpContext) {
    const data = await request.all();
    const name = await request.input("name");
    const { id } = request.params;

    return {
      message: `User ${name} with ID ${id} created`,
      data,
    };
  }
}
```
