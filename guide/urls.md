# URL Generation

The H3ravel URL layer provides a fluent and type-safe API for building, signing, and manipulating URLs.  
It also exposes a set of request-aware helpers that simplify working with the current, full, or previous request URLs.

> The URL builder and helpers are automatically registered by the `UrlServiceProvider`.

## Overview

The URL utilities in H3ravel are designed for:

- Building URLs for routes, controller actions, or custom paths.
- Generating signed and temporary signed URLs.
- Reading and modifying URLs through a fluent interface.
- Accessing current and previous request URLs directly from helpers.

## UrlServiceProvider

The `UrlServiceProvider` registers all URL-related services in the container, including:

- The `Url` builder class.
- The global helper functions (`to`, `route`, `signedRoute`, `temporarySignedRoute`, `action`, `url`).
- The `RequestAwareHelpers` instance, which provides access to the current request context.

The `UrlServiceProvider` will be auto registered but in rare occations where this does not happen, you can manually register it in `src/bootstrap/providers.ts`

```ts
import { UrlServiceProvider } from '@h3ravel/url';

export default <Array<new (_app: Application) => ServiceProvider>>[
  ...,
  UrlServiceProvider,
  ...,
];
```

You can also register it in `src/bootstrap/app.ts`

```ts
import { UrlServiceProvider } from '@h3ravel/url';

const app = new Application(process.cwd());

app.register(UrlServiceProvider);
```

## Creating URLs

The `Url` class exposes several static methods to build URLs depending on the source.

### `Url.of(url: string, app?: Application): Url`

Creates a `Url` instance from a full URL string.

```ts
const absolute = Url.of('https://example.com/path?active=true');
```

### `Url.to(path: string, app?: Application): Url`

Builds a URL relative to the application’s base URL.

```ts
const dashboard = Url.to('/dashboard');
```

### `Url.route(name: string, params?: Record<string, any>, app?: Application): Url`

Creates a URL from a named route.

```ts
const profile = Url.route('user.show', { id: 42 });
```

### `Url.signedRoute(name: string, params?: Record<string, any>, app?: Application): Url`

Generates a signed URL that can be verified to prevent tampering.

```ts
const secureLink = Url.signedRoute('verify.email', { token: 'abc123' });
```

### `Url.temporarySignedRoute(name: string, params: Record<string, any> | undefined, expiration: number, app?: Application): Url`

Creates a signed URL that expires after a specified time in milliseconds.

```ts
const invite = Url.temporarySignedRoute('invite.accept', { id: 55 }, 60000);
```

### `Url.action(controller: string | [Controller, string], params?: Record<string, any>, app?: Application): Url`

Generates a URL pointing to a specific controller method.

```ts
const contact = Url.action('SupportController@create');

// OR

import { SupportController } from 'App/Http/Controllers/SupportController';

const contact = Url.action([SupportController, 'create']);
```

## Modifying URLs (Fluent API)

Once created, URLs can be modified using chainable methods that follow the `UrlContract`.

```ts
const url = Url.to('/docs')
  .withScheme('https')
  .withHost('docs.h3ravel.com')
  .withQuery({ page: 2 })
  .withFragment('top')
  .toString();
```

### Available Fluent Methods

| Method                                         | Description                                        |
| :--------------------------------------------- | :------------------------------------------------- |
| `withScheme(scheme: string)`                   | Set the protocol (e.g., `http`, `https`).          |
| `withHost(host: string)`                       | Define the domain or subdomain.                    |
| `withPort(port: number)`                       | Assign a custom port.                              |
| `withPath(path: string)`                       | Change or replace the path.                        |
| `withQuery(query: Record<string, any>)`        | Set query parameters.                              |
| `withQueryParams(params: Record<string, any>)` | Merge additional query parameters.                 |
| `withFragment(fragment: string)`               | Add or modify a fragment (hash).                   |
| `toString()`                                   | Convert the URL to its full string representation. |

## Request-Aware Helpers

Request-aware helpers allow convenient access to runtime request data such as the current or previous URL.
They are provided through the `RequestAwareHelpers` class or via the global `url()` helper.

```ts
// Get current URL
const requestUrl = url().current();

// Get full URL with query string
const fullUrl = url().full();

// Get previous URL
const previous = url().previous();

// Get previous path only
const previousPath = url().previousPath();

// Get current url with query parameters
const query = url().query();
```

### Methods

| Method           | Description                                                    |
| :--------------- | :------------------------------------------------------------- |
| `current()`      | Returns the current request path (without query).              |
| `full()`         | Returns the full current URL with query string.                |
| `previous()`     | Retrieves the previous request URL (from session or referrer). |
| `previousPath()` | Retrieves the previous path only.                              |
| `query()`        | Returns all current query parameters.                          |

## Global Helper Functions

H3ravel exposes global URL helpers that can be used anywhere once the service provider is loaded.

| Helper                                                                                 | Description                                                     |
| :------------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| `to(path: string)`                                                                     | Create a URL relative to the app’s base URL.                    |
| `route(name: string, params?: Record<string, any>)`                                    | Generate a URL for a named route.                               |
| `signedRoute(name: string, params?: Record<string, any>)`                              | Generate a signed URL.                                          |
| `temporarySignedRoute(name: string, params?: Record<string, any>, expiration: number)` | Generate a temporary signed URL.                                |
| `action(controller: string \| [Controller, string], params?: Record<string, any>)`     | Create a URL from a controller action.                          |
| `url()`                                                                                | Access the `RequestAwareHelpers` for current/previous URL data. |

::: code-group

```ts [Example - Class Based]
const userUrl = Url.route('user.show', { id: 1 });
```

```ts [Example - Helper Based]
const userUrl = route('user.show', { id: 1 });
```

:::

## Security and Signatures

Signed URLs add a layer of integrity verification, ensuring links cannot be modified without invalidating their signature.
Use the following methods for security validation and signature generation.

| Method                                                  | Description                           |
| :------------------------------------------------------ | :------------------------------------ |
| `withSignature(app?: Application, expiration?: number)` | Add a signature to the current URL.   |
| `hasValidSignature(app?: Application)`                  | Verify if a URL’s signature is valid. |

```ts
const signed = Url.to('/settings').withSignature();
if (signed.hasValidSignature()) {
  // proceed with request
}
```

## Example Usages

```ts [JavaScript]
const link = route('post.show', { id: 10 });
```

```ts
// Get the full current URL
const fullUrl = url().full();

// Create a temporary signed route
const temp = temporarySignedRoute('reset.password', { token: 'xyz' }, 3600000);
```

## Notes

> WIP: Route model binding and implicit controller URL resolution are planned for future releases.

> WIP: Support for signed URL middleware verification will be added to `@h3ravel/http`.
