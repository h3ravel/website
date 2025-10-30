# Get Started

## Installation

Before creating a new application, make sure Node.js and npm are installed on your machine. h3ravel requires Node.js version 20 or higher.

You can install Node.js using the official installer or via Volta, a cross-platform tool that lets you manage and run multiple Node.js versions on your system.

### Project Scaffolding

These commands will download the create-h3ravel initializer package and begin the installation process.

You may customize the initial project output using CLI flags but you can skip all that and just go ahead and install.

::: code-group

```sh [npx]
$ npx create h3ravel
```

```sh [npm]
$ npm init h3ravel@latest
```

```sh [pnpm]
$ pnpm create h3ravel@latest
```

```sh [yarn]
$ yarn create h3ravel@latest
```

```sh [bun]
$ bun create h3ravel@latest
```

:::

### Options and Arguments

#### `location`

You can pass the target installation directory with `location` as the first argument to the command. For example:

::: code-group

```sh [npm]
$ npm init h3ravel@latest my-app
```

```sh [pnpm]
$ pnpm create h3ravel@latest my-app
```

```sh [yarn]
$ yarn create h3ravel@latest my-app
```

```sh [bun]
$ bun create h3ravel@latest my-app
```

:::

This argument is optional and the command will prompt you to enter the installation `location` if not provided.

> **Note** - The target location directory must be empty or the command will fail.

#### `--kit` | `-k`

You can also use your own starter kit hosted on Github, Gitlab, or Bitbucket, use the `--kit` flag to define the repo URL, if not provided, you will be prompted to choose from a list of available options.

::: code-group

```sh [npm]
# Download from GitHub
$ npm init h3ravel -- --kit="github:github_user/repo"

# Github is the default provider, so if not specified, it will be assumed as github
$ npm init h3ravel -- --kit="github_user/repo"

# Download from GitLab
$ npm init h3ravel -- --kit="gitlab:user/repo"

# Download from BitBucket
$ npm init h3ravel -- --kit="bitbucket:user/repo"
```

```sh [pnpm]
# Download from GitHub
$ pnpm create h3ravel -- --kit="github:github_user/repo"

# Github is the default provider, so if not specified, it will be assumed as github
$ pnpm create h3ravel -- --kit="github_user/repo"

# Download from GitLab
$ pnpm create h3ravel -- --kit="gitlab:user/repo"

# Download from BitBucket
$ pnpm create h3ravel -- --kit="bitbucket:user/repo"
```

```sh [yarn]
# Download from GitHub
$ yarn create h3ravel -- --kit="github:github_user/repo"

# Github is the default provider, so if not specified, it will be assumed as github
$ yarn create h3ravel -- --kit="github_user/repo"

# Download from GitLab
$ yarn create h3ravel -- --kit="gitlab:user/repo"

# Download from BitBucket
$ yarn create h3ravel -- --kit="bitbucket:user/repo"
```

```sh [bun]
# Download from GitHub
$ bun create h3ravel -- --kit="github:github_user/repo"

# Github is the default provider, so if not specified, it will be assumed as github
$ bun create h3ravel -- --kit="github_user/repo"

# Download from GitLab
$ bun create h3ravel -- --kit="gitlab:user/repo"

# Download from BitBucket
$ bun create h3ravel -- --kit="bitbucket:user/repo"
```

:::

You can also pass the branch or tag name as follows:

::: code-group

```sh [npm]
# Branch name
$ npm init h3ravel -- --kit="github:github_user/repo#branch-name"

# Tag name
$ npm init h3ravel -- --kit="github:github_user/repo#v1.0.0"
```

```sh [pnpm]
# Branch name
$ pnpm create h3ravel -- --kit="github:github_user/repo#branch-name"

# Tag name
$ pnpm create h3ravel -- --kit="github:github_user/repo#v1.0.0"
```

```sh [yarn]
# Branch name
$ yarn create h3ravel -- --kit="github:github_user/repo#branch-name"

# Tag name
$ yarn create h3ravel -- --kit="github:github_user/repo#v1.0.0"
```

```sh [bun]
# Branch name
$ bun create h3ravel -- --kit="github:github_user/repo#branch-name"

# Tag name
$ bun create h3ravel -- --kit="github:github_user/repo#v1.0.0"
```

:::

#### `--token` | `-t`

If you are using a custom starter kit hosted on a private repository, then you can pass the authentication token with the `--token` options:

::: code-group

```sh [npm]
$ npm init h3ravel -- --kit="github:github_user/repo" --token="github_token"
```

```sh [pnpm]
$ pnpm create h3ravel -- --kit="github:github_user/repo" --token="github_token"
```

```sh [yarn]
$ yarn create h3ravel -- --kit="github:github_user/repo" --token="github_token"
```

```sh [bun]
$ bun create h3ravel -- --kit="github:github_user/repo" --token="github_token"
```

:::

## Start Developing

Navigate into the newly created project folder and run the Musket CLI command to start the dev server.

::: code-group

```sh [npx]
$ npx musket fire"
```

```sh [npm]
$ npm musket fire"
```

```sh [pnpm]
$ pnpm musket fire"
```

```sh [yarn]
$ yarn musket fire"
```

```sh [bun]
$ bun musket fire"
```

:::

You’ll see the dev server compiling your new application and once it is finished, you'll get a link to open up your new app in your browser. That’s it! You can now develop your app with your favorite IDE / Code Editor.

Perfect — that’s exactly the right instinct for this kind of documentation.
You want docs that **describe configuration options**, not expose TypeScript structure directly.

Here’s the revised version of the **Global Entry Point** page — same tone and layout, but with the `EntryConfig` interface now expressed as proper documentation text instead of a code dump:

## Global Entry Point

> Introduced in **v1.18.0**, H3ravel now includes a simplified global entry point for bootstrapping applications.
> This function abstracts away repetitive setup steps and provides a consistent way to start any H3ravel-based project.

### Overview

The `h3ravel()` function from `@h3ravel/core` serves as a universal initializer.
It prepares the container, registers providers, and optionally integrates the HTTP layer if available — all in a single call.

### Basic Usage

```ts
import { h3ravel } from '@h3ravel/core';

const app = h3ravel(
  [], // Service Providers
  process.cwd(), // Base Path
  {}, // Configuration
  () => undefined // Optional middleware setup
);

app.fire();
```

### Example with Routes

When using the Router and HTTP packages, routes can be defined before startup.
They are automatically registered when the application fires.

```ts
import { h3ravel } from '@h3ravel/core';
import { RouteServiceProvider } from '@h3ravel/router';
import { HttpServiceProvider } from '@h3ravel/http';

const app = h3ravel([RouteServiceProvider, HttpServiceProvider]);

app.make('router').get('users', () => ({ data: [] }), 'users');
app
  .make('router')
  .post('users', () => ({ data: {}, message: 'Created' }), 'users');

app.fire();
```

### Configuration

You can customize initialization through an optional configuration object passed to `h3ravel()`.

#### Available Options

##### `h3`

Provide your own `H3` app instance.
Useful when `@h3ravel/http` is **not installed**, and you want to have more fine grain control over your application.

##### `initialize`

Determines whether the application should initialize immediately after creation, you will not need to call `app.fire()` with this option enabled.
Defaults to `false`.

##### `autoload`

Automatically discover and register service providers without manually listing them.
Defaults to `false`.

##### `filteredProviders`

Specify a list of provider names that should **never** be registered, even if discovered through autoloading.
Defaults to an empty array.

### Key Advantages

- <icon name="fas fa-square-check" /> Streamlined setup using a single call
- <icon name="fas fa-square-check" /> Works with or without `@h3ravel/http`
- <icon name="fas fa-square-check" /> No hard dependency on HTTP components
- <icon name="fas fa-square-check" /> Returns a fully functional `Application` instance
- <icon name="fas fa-square-check" /> Compatible with both manual and automatic provider discovery
