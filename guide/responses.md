# HTTP Response

The `Response` class represents the outgoing HTTP response for a given request.
It wraps H3’s response handling and provides expressive helpers for sending `JSON`, `HTML`, `plain text`, or `XML` responses — as well as managing `headers`, `status codes`, `redirects`, and `caching`.

In most cases, you won’t need to instantiate it manually.
It’s automatically available through dependency injection or via the `HttpContext` in callable routes.

## Overview

- Set HTTP status codes and headers
- Send JSON or plain text responses
- Return raw HTML and XML content
- Perform HTTP redirects
- Access the underlying H3 event

## Accessing the Response Instance

### Using `HttpContext` in callable routes

When working directly in callable routes, you can destructure the `response` (and other properties) from the `HttpContext`:

```ts
import { HttpContext } from '@h3ravel/http';

Route.get(
  '/hello',
  ({ response }: HttpContext) => {
    return response.json({ message: 'Hello World' });
  },
  'hello.route'
);
```

> 💡 `HttpContext` includes `{ request, response, app, params, route }` and other per-request properties.

### Injecting via the Service Container

In controllers or services bound to the H3ravel container, you can inject the `Response` instance directly:

```ts
export class UserController extends Controller {
  @Injectable()
  async store(request: Request, response: Response) {
    return response
      .setStatusCode(202)
      .json({ message: `User ${request.input('name')} created` });
  }
}
```

### `response()` helper

For convinience, H3ravel also provides a `response()` helper

```ts
response()
  .setStatusCode(202)
  .json({ message: `User ${request.input('name')} created` });
```

When injected, the `Response` is automatically scoped to the active `H3Event` and the current `Application` instance.

## Basic Usage

### Send JSON

```ts
response.json({ success: true });
```

### Send HTML

```ts
response.html('<h1>Hello World</h1>');
```

### Send Plain Text

```ts
response.text('Plain text message');
```

### Send XML

```ts
response.xml('<note>Hello XML</note>');
```

All send methods can optionally **return the raw HTTP response** by passing a second argument `true`:

```ts
const raw = response.json({ data: 'ok' }, true);
```

## Redirects

Redirect the client to another URL:

```ts
response.redirect('/dashboard');
```

Or specify a status code and custom status text:

```ts
response.redirect('/dashboard', 302, 'Found');
```

## Managing Status Codes

Set or retrieve the current HTTP status code:

```ts
response.setStatusCode(201);
console.log(response.getStatusCode()); // 201
```

## Headers and Caching

You can easily attach headers and control cache directives:

```ts
response
  .setHeader('X-Powered-By', 'H3ravel')
  .setCache({ public: true, max_age: 3600 });
```

To set multiple headers at once:

```ts
response.withHeaders({
  'X-Custom': 'Example',
  'Cache-Control': 'no-store',
});
```

## Exception Handling

Attach an exception to a response or immediately throw it as an HTTP response exception:

```ts
response.withException(new Error('Invalid payload')).throwResponse();
```

## Response State Helpers

The `Response` class inherits multiple predicates from `HttpResponse` for quick checks:

| Method            | Description                             |
| :---------------- | :-------------------------------------- |
| `isSuccessful()`  | Returns true if status is 2xx           |
| `isClientError()` | Returns true if status is 4xx           |
| `isServerError()` | Returns true if status is 5xx           |
| `isRedirect()`    | Returns true if status is a redirect    |
| `isEmpty()`       | Returns true if response has no content |
| `isOk()`          | Returns true if status is 200           |
| `isForbidden()`   | Returns true if status is 403           |
| `isNotFound()`    | Returns true if status is 404           |

## Debugging

Dump the response object for inspection:

```ts
response.dump();
```

This outputs headers, content, and status information.

## Reference Table — Inherited from `HttpResponse`

| Method                                  | Description                                                      |
| :-------------------------------------- | :--------------------------------------------------------------- |
| `setStatusCode(code, text?)`            | Set HTTP status code and optional reason phrase                  |
| `getStatusCode()`                       | Retrieve current HTTP status code                                |
| `setCharset(charset)`                   | Set the response charset                                         |
| `getCharset()`                          | Get current charset                                              |
| `setHeader(name, value)`                | Set a specific header                                            |
| `withHeaders(headers)`                  | Merge multiple headers into the response                         |
| `setProtocolVersion(version)`           | Set the HTTP protocol version (1.0 or 1.1)                       |
| `getProtocolVersion()`                  | Get the protocol version                                         |
| `setPublic()`                           | Mark response as cacheable by shared caches                      |
| `setPrivate()`                          | Mark response as private (uncacheable by shared caches)          |
| `setCache(options)`                     | Configure cache headers (`max_age`, `public`, `immutable`, etc.) |
| `getMaxAge()`                           | Get cache max-age (in seconds)                                   |
| `setMaxAge(value)`                      | Set cache max-age (in seconds)                                   |
| `setClientTtl(seconds)`                 | Set time-to-live for client caches                               |
| `setSharedMaxAge(value)`                | Set shared (proxy) cache max-age                                 |
| `setTtl(seconds)`                       | Set total time-to-live for all caches                            |
| `getTtl()`                              | Get remaining TTL in seconds                                     |
| `getDate()`                             | Get the `Date` header as a DateTime instance                     |
| `getAge()`                              | Get the response age (in seconds)                                |
| `getExpires()`                          | Get the `Expires` header as a DateTime                           |
| `getLastModified()`                     | Retrieve the `Last-Modified` header as a DateTime                |
| `setLastModified(date?)`                | Set the `Last-Modified` header                                   |
| `getEtag()`                             | Retrieve the current ETag value                                  |
| `setEtag(etag?, weak?)`                 | Set or remove the ETag header                                    |
| `isCacheable()`                         | Determine if response can be cached                              |
| `isFresh()`                             | Check if response is still fresh                                 |
| `isValidateable()`                      | Check if response can be validated via conditional requests      |
| `expire()`                              | Mark response as stale                                           |
| `setStaleIfError(value)`                | Define stale-if-error directive                                  |
| `setStaleWhileRevalidate(value)`        | Define stale-while-revalidate directive                          |
| `setNotModified()`                      | Transform into a 304 Not Modified response                       |
| `isInvalid()`                           | True if response code is invalid                                 |
| `isInformational()`                     | True if status is 1xx                                            |
| `isRedirection()`                       | True if status is 3xx                                            |
| `sendHeaders(statusCode?)`              | Send headers before finalizing response                          |
| `prepare(request)`                      | Prepare response before sending (RFC 2616 compliance)            |
| `ensureIEOverSSLCompatibility(request)` | IE-specific compatibility for SSL downloads                      |
| `withException(e)`                      | Attach an exception to this response                             |
| `throwResponse()`                       | Throw the current response as an exception                       |

Excellent. Here’s the **“Quick Examples”** appendix in our H3ravel documentation tone — clean, practical, and aligned with how we format `Request` and `Router` examples.

## Quick Examples

Here are a few real-world examples of working with the `Response` class in H3ravel applications.

### 1. Returning JSON Data

```ts
export class PostController extends Controller {
  @Injectable()
  async index(response: Response) {
    const posts = await Post.all();

    return response.setStatusCode(200).json({ data: posts });
  }
}
```

💡 _All response methods are chainable, so you can set headers, status, and body inline._

### 2. Returning Paginated Results

```ts
import { Post } from 'App/Models/Post';

export class PostController extends Controller {
  @Injectable()
  async paginated(request: Request, response: Response) {
    const page = Number(request.input('page', 1));
    const perPage = 10;

    const result = await Post.query().paginate(page, perPage);

    return response.json({
      data: result.data,
      meta: {
        currentPage: result.currentPage(),
        totalPages: result.total(),
      },
    });
  }
}
```

### 3. Sending HTML or Text Responses

```ts
Route.get('/welcome', ({ response }: HttpContext) => {
  return response.html('<h1>Welcome to H3ravel!</h1>');
});
```

```ts
Route.get('/ping', ({ response }: HttpContext) => {
  return response.text('pong');
});
```

### 4. Redirecting Users

```ts
Route.get('/home', ({ response }: HttpContext) => {
  return response.redirect('/dashboard');
});
```

Or with a custom status:

```ts
response.redirect('/login', 301, 'Moved Permanently');
```

### 5. Sending Custom Headers

```ts
response
  .setHeader('X-Powered-By', 'H3ravel')
  .setHeader('Cache-Control', 'no-store')
  .json({ status: 'ok' });
```

You can also merge multiple headers at once:

```ts
response.withHeaders({
  'X-API-Version': '1.0',
  'X-RateLimit-Limit': '60',
});
```

### 6. Returning an Error Response

```ts
export class AuthController extends Controller {
  @Injectable()
  async login(request: Request, response: Response) {
    const user = await User.verify(
      request.input('email'),
      request.input('password')
    );

    if (!user) {
      return response.setStatusCode(401).json({ error: 'Invalid credentials' });
    }

    return response.json({ token: user.generateToken() });
  }
}
```

### 7. Attaching Exceptions

If a response represents an error, you can attach the exception for downstream handling:

```ts
response
  .withException(new Error('User not found'))
  .setStatusCode(404)
  .json({ message: 'User not found' });
```

Or immediately throw it as a `HttpResponseException`:

```ts
response
  .withException(new Error('Forbidden'))
  .setStatusCode(403)
  .throwResponse();
```

### 8. Caching Responses

```ts
response.setCache({ public: true, max_age: 3600 }).json({ cached: true });
```

Or mark as private:

```ts
response
  .setPrivate()
  .setCache({ max_age: 0 })
  .json({ message: 'Private data' });
```

### 9. Combining With Requests

```ts
Route.post('/users', async ({ request, response }: HttpContext) => {
  const name = request.input('name');

  // Create the user...
  return response
    .setStatusCode(201)
    .json({ message: `User ${name} created successfully` });
});
```

### 10. Streaming or Sending Files

When working at the edge or using H3 native response APIs, you can stream directly through the event:

```ts
export class StreamController extends Controller {
  @Injectable()
  async stream(request: Request, response: Response) {
    let interval: NodeJS.Timeout;
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue('<ul>');

        interval = setInterval(() => {
          controller.enqueue('<li>' + Math.random() + '</li>');
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          controller.close();
        }, 1000);
      },
      cancel() {
        clearInterval(interval);
      },
    });

    return response
      .setStatusCode(200)
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 'no-cache')
      .setHeader('Transfer-Encoding', 'chunked')
      .setContent(stream);
  }
}
```

> In H3ravel, `Response` integrates seamlessly with the underlying `H3Event`, so you can use native H3 utilities like `send`, `sendStream`, and `setHeader` when necessary.

### 11. Dumping Response for Debugging

```ts
response.setStatusCode(200).json({ debug: true }).dump();
```

This prints all internal response data to the console (useful for development).

## Summary

The `Response` class provides a fluent, chainable API for building web responses that feel natural and readable.
Whether you’re returning JSON APIs, HTML views, redirects, or custom headers — `Response` gives you the flexibility to handle every scenario in a unified way, letting you quickly return content, configure headers, manage cache policies, or perform redirects.
