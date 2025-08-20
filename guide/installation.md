# Installation

Before creating a new application, make sure Node.js and npm are installed on your machine. h3ravel requires Node.js version 20 or higher.

You can install Node.js using the official installer or via Volta, a cross-platform tool that lets you manage and run multiple Node.js versions on your system.

## Project Scaffolding

These commands will download the create-h3ravel initializer package and begin the installation process.

You may customize the initial project output using CLI flags but you can skip all that and just go ahead and install.

::: code-group

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

## Options and Arguments

### `location`

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

### `--kit` | `-k`

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

### `--token` | `-t`

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
