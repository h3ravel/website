# Encryption

## Introduction

H3ravel provides a simple and convenient API for encrypting and decrypting data using OpenSSL. It supports both AES-256 and AES-128 encryption algorithms and automatically signs all encrypted values with a message authentication code (MAC) to prevent tampering or modification after encryption.

## Configuration

Before using the encrypter, ensure that an encryption key is defined in your `src/config/app.ts` configuration file. This key is managed by the `APP_KEY` environment variable.

You can generate a secure application key using the Musket command:

::: code-group

```sh [npm]
$ npm musket key:generate
```

```sh [yarn]
$ yarn musket key:generate
```

```sh [pnpm]
$ pnpm musket key:generate
```

```sh [bun]
$ bun musket key:generate
```

:::

This command uses Node's built-in `crypto.randomBytes` function to create a cryptographically secure key. In most cases, this key will be automatically generated during H3ravel’s installation.
