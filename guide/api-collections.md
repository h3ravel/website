# API Collections

API collections transform lists of records into consistent JSON responses.
They accept plain arrays, collection-like values, structured pagination data,
and supported paginator objects.

## Defining A Collection

Define the item resource and collection together. The `collects` property names
the resource used to transform each entry:

```ts
import { Collection, Resource } from '@h3ravel/http';

export class UserResource extends Resource {
  data() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }
}

export class UserCollection extends Collection {
  collects = UserResource;

  data() {
    return this.toObject();
  }
}
```

`toObject()` returns the source items after applying `UserResource` to each
one. Without `collects`, a collection returns normalized source items without
an item-specific transformation.

## Returning Collections

Pass the data to the collection and return it directly:

```ts
export class UserController {
  async index() {
    const users = await User.query().get();

    return new UserCollection(users);
  }
}
```

No manual serialization or `response()` call is required:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    },
    {
      "id": 2,
      "name": "Grace Hopper",
      "email": "grace@example.com"
    }
  ]
}
```

## Structured Pagination

A collection can receive an object containing `data` and `pagination`:

```ts
return new UserCollection({
  data: users,
  pagination: {
    currentPage: 2,
    firstPage: 1,
    lastPage: 4,
    prevPage: 1,
    nextPage: 3,
    from: 16,
    to: 30,
    perPage: 15,
    total: 52,
    path: '/users',
  },
});
```

Pagination values will be moved outside the data array and the configured
`meta` and `links` blocks will be built:

```json
{
  "data": [
    {
      "id": 16,
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    }
  ],
  "meta": {
    "from": 16,
    "to": 30,
    "per_page": 15,
    "total": 52,
    "current_page": 2,
    "last_page": 4,
    "path": "/users?page=2"
  },
  "links": {
    "first": "/users?page=1",
    "last": "/users?page=4",
    "prev": "/users?page=1",
    "next": "/users?page=3"
  }
}
```

Explicit `pagination.links` values take precedence over generated links.

## Paginator Objects

Supported paginator values can be passed directly:

```ts
export class UserController {
  async index(request: Request) {
    const users = await User.query().paginate(
      Number(request.input('page', 1)),
      15,
    );

    return new UserCollection(users);
  }
}
```

The collection extracts the paginator's records and metadata, applies
`UserResource` to every record, and generates pagination extras using the
current request URL and resource configuration.

## Cursor Pagination

Supply cursor information beside `data`:

```ts
return new UserCollection({
  data: users,
  cursor: {
    previous: previousCursor,
    next: nextCursor,
  },
});
```

Include `cursor` in `paginatedExtras` to emit it as a top-level block:

```ts
export default (): ResourceConfig => ({
  paginatedExtras: ['meta', 'links', 'cursor'],
});
```

```json
{
  "data": [],
  "cursor": {
    "previous": "previous-token",
    "next": "next-token"
  }
}
```

A structured input may contain both `pagination` and `cursor`; each configured
extra is serialized alongside the transformed data.

## Additional Data And Metadata

Use `additional()` for top-level values:

```ts
return new UserCollection(users).additional({
  message: 'Users retrieved successfully',
});
```

Use `withMeta()` for fluent metadata. It is merged with generated pagination
metadata rather than replacing it:

```ts
return new UserCollection(users).withMeta({
  filters: {
    active: true,
  },
});
```

A collection class can override `with()` when the same metadata belongs on
every response.

## Nested Collections

Collections can be nested directly inside another resource:

```ts
export class TeamResource extends Resource {
  data() {
    return {
      id: this.id,
      name: this.name,
      members: new UserCollection(this.members ?? []),
    };
  }
}
```

Use `new UserCollection(...).toObject()` instead when the transformed array
must be inspected or merged before it is returned from `data()`.

## Status And Headers

Collections support the same transport customization as resources:

```ts
return new UserCollection(users)
  .response()
  .setStatusCode(206)
  .setHeaders({
    'X-Result-Count': String(users.length),
  });
```

Return the collection directly when the default status and headers are
sufficient.

## Pagination Configuration

Pagination output is controlled in `src/config/resources.ts`:

```ts
import type { ResourceConfig } from '@h3ravel/http';

export default (): ResourceConfig => ({
  baseUrl: 'https://api.example.com',
  pageName: 'page',
  paginatedExtras: ['meta', 'links'],
  paginatedLinks: {
    first: 'first',
    last: 'last',
    prev: 'prev',
    next: 'next',
  },
  paginatedMeta: {
    from: 'from',
    to: 'to',
    per_page: 'per_page',
    total: 'total',
    current_page: 'current_page',
    last_page: 'last_page',
    path: 'path',
  },
  cursorMeta: {
    previous: 'previous',
    next: 'next',
  },
});
```

`paginatedExtras` may also be an object when the top-level `meta`, `links`, or
`cursor` keys need custom names.

For single-object transformations and conditional attributes, see
[API Resources](./api-resources.md).
