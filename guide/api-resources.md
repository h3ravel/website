# API Resources

API resources transform domain objects into stable JSON response shapes.
H3ravel's resource API is integrated with the HTTP
response lifecycle, so a resource can be returned directly from a controller.

## Defining A Resource

Extend `Resource` and implement `data()` to define the public representation:

```ts
import { Resource } from '@h3ravel/http';

export class UserResource extends Resource {
  data() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }
}
```

Properties of the wrapped object are proxied onto the resource. Use
`toObject()` when the original serializable value is already the desired shape:

```ts
export class UserResource extends Resource {
  data() {
    return this.toObject();
  }
}
```

## Returning Resources

Return the resource itself. Calling `json()`, `response()`, or `getBody()` is not
required for a normal controller response:

```ts
export class UserController {
  async show(user: User) {
    return new UserResource(user);
  }
}
```

With the default response configuration, H3ravel returns:

```json
{
  "data": {
    "id": 1,
    "name": "Ada Lovelace",
    "email": "ada@example.com"
  }
}
```

Resources are also awaitable. Awaiting one resolves its serialized body, though
controllers can normally return the resource directly.

## Additional Data And Metadata

Use `additional()` for top-level response values:

```ts
return new UserResource(user).additional({
  message: 'User retrieved successfully',
});
```

```json
{
  "data": {
    "id": 1,
    "name": "Ada Lovelace"
  },
  "message": "User retrieved successfully"
}
```

Use `withMeta()` for fluent response metadata:

```ts
return new UserResource(user).withMeta({
  requestId: request.id,
});
```

A resource class can also override `with()` when metadata should be attached to
every instance of that resource.

## Conditional Attributes

Conditional helpers omit values from the final serialized payload
rather than returning placeholder values.

### `when()`

Include a value only when its condition is truthy:

```ts
email: this.when(this.canViewEmail, this.email);
```

Pass a callback to defer expensive work until the condition succeeds:

```ts
statistics: this.when(this.canViewStatistics, () => this.buildStatistics());
```

### `whenNotNull()`

Include a value unless it is `null` or `undefined`:

```ts
avatar: this.whenNotNull(this.avatarUrl);
```

Values such as `false`, `0`, and an empty string are preserved.

### `mergeWhen()`

Conditionally merge several attributes:

```ts
export class UserResource extends Resource {
  data() {
    return {
      id: this.id,
      name: this.name,
      ...this.mergeWhen(this.isAdmin, {
        permissions: this.permissions,
        scope: 'admin',
      }),
    };
  }
}
```

`mergeWhen()` also accepts a callback:

```ts
...this.mergeWhen(this.includeProfile, () => ({
  profile: this.buildProfile(),
}))
```

These helpers work inside item resources used by collections as well.

## Nested Resources And Collections

Return nested resource or collection instances from `data()`:

```ts
import { Collection, Resource } from '@h3ravel/http';

export class CommentResource extends Resource {
  data() {
    return {
      id: this.id,
      body: this.body,
    };
  }
}

export class CommentCollection extends Collection {
  collects = CommentResource;

  data() {
    return this.toObject();
  }
}

export class PostResource extends Resource {
  data() {
    return {
      id: this.id,
      title: this.title,
      author: new UserResource(this.author),
      comments: new CommentCollection(this.comments ?? []),
    };
  }
}
```

Calling `toObject()` on the nested collection is also supported when the
transformed array is needed immediately for further composition.

## Status And Headers

Use `response()` only when the resource needs to customize transport details:

```ts
return new UserResource(user)
  .additional({ message: 'User created' })
  .response()
  .setStatusCode(201)
  .setHeaders({
    'X-Resource': 'user',
  });
```

H3ravel preserves the resource body, status code, and headers. Returning
`new UserResource(user)` remains the preferred form when no transport
customization is needed.

## Resource Configuration

Configure resource serialization in `src/config/resources.ts`:

```ts
import type { ResourceConfig } from '@h3ravel/http';

export default (): ResourceConfig => ({
  preferredCase: 'camel',
  responseStructure: {
    wrap: true,
    rootKey: 'data',
  },
  paginatedExtras: ['meta', 'links'],
  pageName: 'page',
});
```

The configuration controls key casing, response wrapping, pagination extras,
link and metadata names, cursor names, base URLs, and the page query parameter.

See [API Collections](./api-collections.md) for list transformation and
pagination.
