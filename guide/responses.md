# HTTP Response

The Response class in H3ravel provides an expressive interface for crafting HTTP responses. It wraps H3’s response handling and adds convenient helpers for setting `headers`, returning `JSON`, `HTML`, `plain text`, and performing `redirects`.

## Overview

- Set HTTP status codes and headers
- Send JSON or text responses
- Return raw HTML content
- Perform HTTP redirects
- Access the underlying H3 event

## Available Methods

### `setStatusCode(code)`

Sets the HTTP status code for the response.

```ts
response.setStatusCode(201);
```

### `setHeader(name, value)`

Adds or updates a header on the response.

```ts
response.setHeader("X-Custom-Header", "H3ravel");
```

### `html(content)`

Returns raw HTML content as the response body.

```ts
return response.html("<h1>Hello World</h1>");
```

### `json(data)`

Sends a JSON response.

```ts
return response.json({ success: true, message: "User created" });
```

### `text(data)`

Sends a plain text response.

```ts
return response.text("This is a plain text response");
```

### `redirect(url, status?)`

Redirects the request to another URL.
You can specify a custom status code (default is 302).

```ts
return response.redirect("/dashboard");
return response.redirect("/login", 301);
```

### `getEvent()`

Retrieves the underlying H3Event object.
You can also access nested properties directly.

```ts
const event = response.getEvent();
const method = response.getEvent("method");
```

## Example Usage

```ts
import { Controller, HttpContext } from "@h3ravel/core";

export class AuthController extends Controller {
  async login({ request, response }: HttpContext) {
    const credentials = await request.all();

    if (credentials.username === "admin") {
      return response.setStatusCode(200).json({ message: "Login successful" });
    }

    return response.setStatusCode(401).json({ message: "Unauthorized" });
  }

  async redirectToDashboard({ response }: HttpContext) {
    return response.redirect("/dashboard");
  }
}
```
