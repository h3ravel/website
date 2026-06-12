# Testing

## Introduction

H3ravel provides an HTTP test client through `@h3ravel/foundation`. The client boots the application without starting a network server and uses [Parasito](https://github.com/arkstack-hq/parasito) for fluent HTTP requests and assertions.

The examples below use [Vitest](https://vitest.dev/), but the client can be used with any test runner.

## Creating A Test Client

Call `testApp` in your test setup:

```ts
import { testApp, type TestClient } from '@h3ravel/foundation'
import { beforeAll, describe, it } from 'vitest'

describe('home page', () => {
  let client: TestClient

  beforeAll(async () => {
    client = await testApp()
  })

  it('returns a successful response', async () => {
    await client
      .get('/')
      .expect(200)
  })
})
```

When called without an argument, `testApp` loads `src/bootstrap/providers`, configures the application's web and API routes, and boots the application without opening a port.

Each HTTP method creates a fresh Parasito request, so one client can be reused across tests without carrying headers, request bodies, or assertions into the next request.

## Making Requests

The test client supports the common HTTP methods:

```ts
await client.get('/users')
await client.post('/users')
await client.put('/users/1')
await client.patch('/users/1')
await client.delete('/users/1')
await client.head('/users')
await client.options('/users')
```

Use `query`, `set`, `auth`, and `send` to configure a request:

```ts
await client
  .post('/api/users')
  .query({ notify: true })
  .set('x-request-id', 'test-request')
  .auth('api-token')
  .send({
    name: 'Ada',
    email: 'ada@example.com',
  })
  .expect(201)
```

Plain objects and arrays passed to `send` are serialized as JSON.

## Response Assertions

Use `expect` to assert response status, headers, and bodies:

```ts
await client
  .get('/api/users/1')
  .expect(200)
  .expect('content-type', /json/)
  .expect({
    id: 1,
    name: 'Ada',
  })
```

Text responses can be matched with a string or regular expression:

```ts
await client
  .get('/status')
  .expect(200)
  .expect(/ready/i)
```

For more specific checks, pass an assertion callback. The normalized response contains `status`, `ok`, `headers`, `text`, and `body`:

```ts
import { expect, it } from 'vitest'

it('returns the requested user', async () => {
  await client
    .get<{ id: number; name: string }>('/api/users/1')
    .expect(200)
    .expect(({ body, headers }) => {
      expect(body.id).toBe(1)
      expect(body.name).toBe('Ada')
      expect(headers.get('content-type')).toMatch(/json/)
    })
})
```

Requests are promise-like and return the normalized response when awaited:

```ts
const response = await client.get<{ users: unknown[] }>('/api/users')

expect(response.ok).toBe(true)
expect(response.body.users).toHaveLength(2)
```

## Testing A Custom Application

You may pass an existing H3ravel application to `testApp`. This is useful when a test needs to register test-specific services or perform setup before making requests:

```ts
import App from '../src/bootstrap/app'
import { testApp } from '@h3ravel/foundation'

const application = await new App().init()
const client = await testApp(application)

await client.get('/').expect(200)
```

The supplied application must be booted with an H3 instance. If it does not contain one, `testApp` throws an initialization error instead of silently testing an empty application.
