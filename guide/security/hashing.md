# Hashing

## Introduction

The [H3ravel](https://h3ravel.toneflix.net) Hashing package provides secure framework-agnostic Bcrypt and Argon2 hashing for storing user passwords with first class support for H3ravel, what this means is that while this package is designed for use with the H3ravel framework, there's absolutely nothing stopping you from using it with any other framework, or no framework at al. If you are using one of the H3ravel application starter kits, Bcrypt will be used for registration and authentication by default.

> Bcrypt is a great choice for hashing passwords because its "work factor" is adjustable, which means that the time it takes to generate a hash can be increased as hardware power increases. When hashing passwords, slow is good. The longer an algorithm takes to hash a password, the longer it takes malicious users to generate "rainbow tables" of all possible string hash values that may be used in brute force attacks against applications.

## Installation

To use password hashing, you may need to install the `@h3ravel/hashing` package by running:

::: code-group

```sh [npm]
$ npm install @h3ravel/hashing --save
```

```sh [yarn]
$ yarn add @h3ravel/hashing
```

```sh [pnpm]
$ pnpm add @h3ravel/hashing
```

```sh [bun]
$ bun create @h3ravel/hashing
```

:::

## Configuration

By default, H3ravel uses the `bcrypt` hashing driver when hashing data. However, several other hashing drivers are supported, including `argon` and `argon2id`.

You may specify your application's hashing driver using the `HASH_DRIVER` environment variable. But, if you want to customize all of H3ravel's hashing driver options, you should publish the complete hashing configuration file using the `config:publish` Musket command if you use H3ravel:

```sh
npx musket config:publish hashing
```

If you do not use H3ravel you should create a `hashing.config.[ts|js]` at the root of your project with the following content:

```js
import { defineConfig } from '@h3ravel/hashing';

export default defineConfig({
  driver: 'bcrypt',
  bcrypt: {
    rounds: 12,
    verify: true,
    limit: null,
  },
  argon: {
    memory: 65536,
    threads: 1,
    time: 4,
    verify: true,
  },
});
```

## Basic Usage

### Hashing Passwords

You may hash a password by calling the make method on the `Hash` class if you use H3ravel or the `HashManager` class for fine grained control and off H3ravel use from the `@h3ravel/hashing` package:

```ts
import { Controller } from '@h3ravel/core';
import { Request } from '@h3ravel/http';
import { Hash } from '@h3ravel/hashing';
import { DB } from '@h3ravel/database';

export class PasswordController extends Controller {
  /**
   * Update the password for the user.
   */
  public update(request: Request): RedirectResponse {
    await DB.table('users')
      .where('email', 'dj@x.com')
      .update({
        password: await Hash.make('password'),
      });

    return {
      message: 'Your password has successfully been updated',
    };
  }
}
```

### `HashManager` Usage

The `HashManager` class gives you finer grain control over the initialization process.

```ts
import { HashManager } from '@h3ravel/hashing';

const config = {};

const Hash = new HashManager(config);
```

You can even go futher by calling the `init` method which allows you to provide a path to a custom configuration file

```ts
import { HashManager } from '@h3ravel/hashing';
import path from 'node:path';

const config = {};
const basePath = path.join(process.cwd(), 'src/configs');

const Hash = new HashManager(config).init(basePath);
```

### Adjusting The Bcrypt Work Factor

If you are using the Bcrypt algorithm, the `make` method allows you to manage the work factor of the algorithm using the rounds option; however, the default work factor managed by H3ravel is acceptable for most applications:

```ts
const hashed = Hash.make('password', {
  rounds: 12,
});
```

### Adjusting The Argon2 Work Factor

If you are using the `Argon2` algorithm, the make method allows you to manage the work factor of the algorithm using the `memory`, `time`, and `threads` options; however, the default values managed by H3ravel are acceptable for most applications:

```ts
const hashed = Hash.make('password', {
  time: 2,
  threads: 2,
  memory: 1024,
});
```

### Verifying That a Password Matches a Hash

The check method provided by the `Hash` class allows you to verify that a given plain-text string corresponds to a given hash:

```ts
if (Hash.check('plain-text', hashedPassword)) {
  // The passwords match...
}
```

### Determining if a Password Needs to be Rehashed

The `needsRehash` method provided by the `Hash` class allows you to determine if the work factor used by the hasher has changed since the password was hashed. Some applications choose to perform this check during the application's authentication process:

```ts
if (Hash.needsRehash(hashed)) {
  const hashed = Hash.make('plain-text');
}
```

### Hash Algorithm Verification

To prevent hash algorithm manipulation, H3ravel's `Hash.check` method will first verify the given hash was generated using the application's selected hashing algorithm. If the algorithms are different, a `RuntimeException` exception will be thrown.

This is the expected behavior for most applications, where the hashing algorithm is not expected to change and different algorithms can be an indication of a malicious attack. However, if you need to support multiple hashing algorithms within your application, such as when migrating from one algorithm to another, you can disable hash algorithm verification by setting the `HASH_VERIFY` environment variable to `false`:

```sh
HASH_VERIFY=false
```
