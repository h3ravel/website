# HTTP Requests

The `Request` class is H3ravel’s unified HTTP request abstraction.
It wraps the native **H3Event** instance and provides a clean, expressive API for working with request input, files, cookies, headers, and metadata — regardless of content type or method.

## Overview

Every incoming HTTP request is converted into a `Request` instance by the H3ravel runtime.
It normalizes data from query strings, JSON payloads, form data, and file uploads into consistent, strongly typed input sources.

The `Request` class can be injected into controllers, middleware, or accessed globally.

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

Alternatively, you can use the global helper:

```ts
const name = request().input('name');
```

## Core Responsibilities

- Normalize all HTTP request data (query, body, cookies, files, headers, etc.)
- Handle multiple content types (`application/json`, `multipart/form-data`, `text/plain`, etc.)
- Provide easy access to route params and request metadata
- Support full-featured file uploads (`UploadedFile` and `UploadedFile[]`)
- Handle method overrides and content negotiation
- Integrate seamlessly with the H3ravel service container and `HttpContext`

## Construction and Lifecycle

```ts
const request = await Request.create(event, app);
```

- **event** → The current `H3Event` instance
- **app** → The active H3ravel `Application` instance

The request is usually instantiated internally by the framework.

## Properties

| Property     | Type                  | Description                       |
| ------------ | --------------------- | --------------------------------- |
| `app`        | `Application`         | The active H3ravel app instance   |
| `event`      | `H3Event`             | The native event object           |
| `params`     | `Record<string, any>` | Route parameters                  |
| `body`       | `unknown`             | Raw or parsed request body        |
| `query`      | `InputBag`            | Query string data                 |
| `request`    | `InputBag`            | Request body data                 |
| `files`      | `FileBag`             | Uploaded files                    |
| `cookies`    | `InputBag`            | Parsed cookies                    |
| `server`     | `ServerBag`           | Server metadata                   |
| `headers`    | `HeaderBag`           | Request headers                   |
| `attributes` | `ParamBag`            | Route and path-derived attributes |

## Input Handling

### `.all(keys?: string | string[])`

Returns all input (merged query + body).
If `keys` is provided, returns only those fields.

```ts
const data = request.all();
const filtered = request.all(['email', 'password']);
```

### `.input(key?: string, defaultValue?: any)`

Retrieves an input value from the merged source.
Returns the entire input bag if no key is provided.

```ts
const email = request.input('email');
const all = request.input();
```

### `.merge(data: Record<string, any>)`

Merges data into the current input source (mutates the instance).

```ts
request.merge({ verified: true });
```

### `.mergeIfMissing(data: Record<string, any>)`

Merges new input only when the key is missing.

### `.only(keys: string[])`

Returns only the specified keys.

### `.except(keys: string[])`

Returns all input except the specified keys.

### `.has(keys: string | string[])`

Checks if one or more keys exist in the input.

### `.missing(keys: string | string[])`

Inverse of `.has()`.

### `.keys()`

Returns all input keys (query + body + files).

## JSON & Content Parsing

### `.isJson()`

Returns `true` if the incoming request content type is JSON.

### `.expectsJson()`

Returns `true` if the request likely expects a JSON response
(e.g. `Accept: application/json` or `X-Requested-With: XMLHttpRequest`).

### `.wantsJson()`

Returns `true` if the request explicitly _wants_ JSON.

### `.json(key?: string, defaultValue?: any)`

Returns the parsed JSON payload.
If `key` is provided, returns a nested field.

```ts
const user = request.json();
const name = request.json('user.name');
```

## File Handling

### `.file(key?: string, defaultValue?: any, expectArray?: boolean)`

Retrieves an uploaded file or array of files from the request.
Supports single or multiple file inputs (`name[]`).

#### Behavior

- If `expectArray` is `true`, returns an array even if only one file was uploaded.
- If `key` is omitted, returns a record of all uploaded files keyed by input name.
- If multiple files are uploaded under the same key, only the first file is returned unless `expectArray` is `true`.

**Example**

```ts
// Get first uploaded file under "avatar"
const avatar = request.file('avatar'); // => UploadedFile

// Get all files for "gallery"
const images = request.file('gallery', [], true); // => UploadedFile[]

// Get all uploaded files
const all = request.file(); // => Record<string, UploadedFile | UploadedFile[]>
```

### `.allFiles()`

Returns all uploaded files keyed by field name.

### `.hasFile(key: string)`

Checks if a file was uploaded under the given field name.

## Metadata & Headers

### `.getHeader(name: string)`

Gets a specific header value.

### `.getAcceptableContentTypes()`

Returns an ordered list of accepted content types.

### `.pjax()`

Returns `true` if the request originated from a PJAX request.

### `.ajax()` / `.isXmlHttpRequest()`

Returns `true` if the request was sent via AJAX.

### `.ip()`

Retrieves the client IP address.

### `.method()` / `.getMethod()` / `.getRealMethod()`

Gets the HTTP method, taking into account method overrides (`_method` or `X-HTTP-Method-Override`).

### `.isMethod(type: string)`

Checks if the request method matches the provided type (case-insensitive).

### `.isMethodSafe()`, `.isMethodIdempotent()`, `.isMethodCacheable()`

HTTP RFC7231-compliant checks for method properties.

## URLs and URIs

### `.uri()`

Returns a `Url` instance for the current request.

### `.fullUrl()`

Returns the complete URL (including query string).

## Server, Cookies & Attributes

### `.server`

Access to environment-level data such as protocol, host, and request time.

### `.cookies`

Access to parsed cookies.

### `.attributes`

Access to route or path parameters.

## Utility & Debugging

### `.dump(...keys: string[])`

Logs specific keys from the request (for debugging).

### `.instance()`

Returns the current instance (for fluent API patterns).

### `.getEvent()`

Returns the underlying `H3Event`, or a nested property when provided a dot path.

```ts
const event = request.getEvent();
const req = request.getEvent('req.url');
```

## Static Methods

### `Request.create(event, app)`

Factory method for async creation and initialization.

### `Request.enableHttpMethodParameterOverride()`

Enables support for `_method` parameter in POST bodies.

### `Request.getHttpMethodParameterOverride()`

Checks if `_method` override support is enabled.

## Integration Notes

- **Dependency Injection** — `Request` is auto-resolved by the H3ravel service container.
- **Content Negotiation** — JSON, form data, and file uploads are normalized automatically.
- **Stream Safety** — Request bodies can be read as text, JSON, or FormData, but only once.
- **Event Context** — Access the original H3 event via `request.getEvent()` for low-level operations.

## Example — Multipart Upload

```ts
export class UploadController extends Controller {
  @Injectable()
  async store(request: Request, response: Response) {
    const avatar = request.file('avatar');

    if (!request.hasFile('avatar')) {
      return response.badRequest({ message: 'No file uploaded' });
    }

    await avatar.moveTo('/tmp/uploads');
    return response.json({ success: true });
  }
}
```

## Example — JSON API Request

```ts
export class SessionController extends Controller {
  @Injectable()
  async login(request: Request, response: Response) {
    const { email, password } = request.json();
    // Validate and authenticate
    return response.json({ token: '...' });
  }
}
```

## Example — Combining Input Sources

```ts
const query = request.query.all();
const payload = request.request.all();

const all = request.all(); // merged
```

## Example — Low-Level Access

```ts
const event = request.getEvent();
const nodeReq = request.getEvent('req');
```

## TypeScript Integration

The `Request` class is fully typed for all supported content sources and public methods.
Each input source (`query`, `request`, `files`, etc.) is type-aware and auto-completes in editors.
