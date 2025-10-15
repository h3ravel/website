# Musket CLI

## Introduction

Musket CLI is a lightweight, framework-agnostic toolkit inspired by Laravel’s Artisan for building expressive command-line interfaces. It is powered by [Commander.js](https://github.com/tj/commander.js) and provides a clean structure and extendable way to building, organizing, and running CLI applications and serves as the console layer for the [H3ravel](https://h3ravel.toneflix.net) framework.

By default, Musket automatically loads configuration, registers commands, and handles parsing. When you need more control, you can enable the `skipParsing` option to access the underlying Commander instance. This lets you hook into the CLI lifecycle, register commands manually, or adjust how input is handled.

Musket is designed to be simple by default and flexible when you need it.

## Installation

Install using your preferred package manager:

::: code-group

```sh [npm]
$ npm install @h3ravel/musket --save
```

```sh [yarn]
$ yarn add @h3ravel/musket
```

```sh [pnpm]
$ pnpm add @h3ravel/musket
```

```sh [bun]
$ bun create @h3ravel/musket
```

:::

## Quick Setup

Musket requires a host application class to attach to.
This can be any class that represents your application’s core:

```ts
class Application {}
```

Initialize Musket with your application:

```ts
import { Kernel } from '@h3ravel/musket';

const app = new Application();

await Kernel.init(app);
```

Once initialized, Musket binds itself to the app as `app.musket`,
allowing you to access and extend the CLI programmatically:

```ts
console.log(app.musket);
```
