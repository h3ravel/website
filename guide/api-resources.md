# API Resources & Collections

H3ravel provides an API Resource system for transforming and formatting data before sending it as an API response. This feature allows you to create structured responses and include additional metadata (like pagination).

## Overview

- Transform and standardize API responses
- Support for pagination metadata
- Send responses automatically or manually
- Add extra contextual data to responses
- Works for single resources or collections

## JsonResource Class

The `JsonResource` class wraps your data and provides helper methods to shape and send JSON responses consistently.

### Basic Example

```ts
import { BaseResource } from "@h3ravel/http";
import { HttpContext } from "@h3ravel/core";

export async function showUser({ request }: HttpContext) {
  const user = { id: 1, name: "John Doe" };

  return BaseResource(request, user).json();
}
```

### Adding Metadata

You can include additional metadata to your resource:

```ts
return BaseResource(request, user).json().additional({
  message: "User retrieved successfully",
});
```

### Pagination

To automatically include pagination data, add a pagination property to your resource:

```ts
const users = {
  data: [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ],
  pagination: {
    from: 1,
    to: 2,
    perPage: 10,
    total: 50,
  },
};

return BaseResource(request, user).json();
```

This will produce

```json
{
  "data": [
    { "id": 1, "name": "John" },
    { "id": 2, "name": "Jane" }
  ],
  "meta": {
    "pagination": {
      "from": 1,
      "to": 2,
      "perPage": 10,
      "total": 50
    }
  }
}
```

### Setting the Status Code

```ts
return BaseResource(request, user).status(201).json();
```

## API Collections

H3ravel’s resource system automatically handles arrays and collections of data.

```ts
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];

return BaseResource(request, user).json();
```
