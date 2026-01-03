# Get Started

## Configuration

Musket is configured at startup through the `Kernel.init()` method.
The configuration object controls how the CLI is identified, what it exposes, and how commands are discovered and registered.

Most applications will define this once at boot and let Musket handle the rest.

```ts
import path from 'path';
import { Kernel } from '@h3ravel/musket';

await Kernel.init(app, {
  name: 'mycli',
  packages: ['@h3ravel/support', '@h3ravel/shared'],
  discoveryPaths: [path.join(process.cwd(), 'src/Commands/*.ts')],
});
```

### What this does

- Sets the CLI name used in help output and usage instructions
- Defines which npm packages are shown when `-V` / `--version` is passed
- Enables automatic command discovery from the specified paths

### When to use configuration

Use the configuration object to:

- Brand your CLI (name, version, description)
- Control version output
- Register commands automatically
- Tune Musket’s startup behavior without manual wiring

From here, you can either:

- Rely on **automatic discovery**, or
- Register commands **manually** using the [`Kernel`](#fluent-initialization-kernel-api) API

### Available Configuration Options

| Option             | Type                                                  | Default     | Description                                                                                                                                                           |
| ------------------ | ----------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **logo**           | `string`                                              | `undefined` | ASCII art-style logo to display at startup.                                                                                                                           |
| **name**           | `string`                                              | `'musket'`  | The name of the CLI application, used in help text and display.                                                                                                       |
| **version**        | `string`                                              | `undefined` | The version of the CLI app we're running (if provided, this will overwrite the value of resolved version from packages config marked as base).                        |
| **skipParsing**    | `boolean`                                             | `false`     | If `true`, Musket will not automatically parse command-line input. This is required if you want to manually control or hook into the underlying `commander` instance. |
| **resolver**       | `<X extends Command>(cmd: X, met: any) => Promise<X>` | `undefined` | A callback that resolves the `handle` method for commands dynamically. Useful for dependency injection or lazy loading of commands.                                   |
| **tsDownConfig**   | `Options`                                             | `undefined` | Configuration for Musket’s internal TypeScript compilation process, used when invoking programmatic builds.                                                           |
| **packages**       | `(string\|{ name: string; alias: string })[]`         | `[]`        | Packages to display when the `-V` flag is used.                                                                                                                       |
| **hideMusketInfo** | `boolean`                                             | `false`     | If `true`, suppresses automatic Musket name and version info in console output.                                                                                       |
| **baseCommands**   | `typeof Command[]`                                    | `[]`        | A list of command classes to preload into the CLI without discovery.                                                                                                  |
| **discoveryPaths** | `string\|string[]`                                    | `[]`        | One or more glob paths where Musket should search and automatically register command files (e.g. `'src/Console/Commands/*.ts'`).                                      |
| **allowRebuilds**  | `boolean`                                             | `false`     | If `true`, commands and CLI structures will rebuild automatically when code changes are detected.                                                                     |
| **rootCommand**    | `typeof Command`                                      | `undefined` | The command to run when the CLI is executed without any arguments                                                                                                     |

## Command Registration

### Base Command List

Besides registering commands via auto discovery, you can also provide a list of commands that will be registered with your `musket` instance via the `baseCommands` option or the `registeredCommands` property of your `app` instance.

```ts
import { Kernel } from '@h3ravel/musket';
import { Application } from './Application';
import { BuildCommand } from './Commands';

const app = new Application();

await Kernel.init(app, {
  baseCommands: [BuildCommand],
});
```

Or

```ts
import { Kernel } from '@h3ravel/musket';
import { BuildCommand } from './Commands';

class Application {
  registeredCommands = [GreetCommand];
}

const app = new Application();

await Kernel.init(app);
```

### Default Root Command

The `rootCommand` option lets you define a command that runs when the CLI is executed without arguments:

```ts
import { Kernel, Command } from '@h3ravel/musket';
import { Application } from './Application';

class DefaultCommand extends Command {
  protected signature = 'default';
  protected description = 'Runs when no arguments are provided';

  async handle() {
    this.info('Welcome to Musket CLI! No arguments were passed.');
  }
}

const app = new Application();

await Kernel.init(app, {
  rootCommand: DefaultCommand,
});
```

Now, running the CLI with no arguments:

```sh
node dist/cli.js
```

Output:

```
Welcome to Musket CLI! No arguments were passed.
```

## Automatic Rebuilds

During development, restarting the CLI after every change gets old fast.
Setting `allowRebuilds` to `true` tells Musket to watch your command sources and automatically rebuild its internal command registry when changes are detected.

```ts
import { Kernel } from '@h3ravel/musket';
import { Application } from './Application';

const app = new Application();

await Kernel.init(app, {
  allowRebuilds: true,
  discoveryPaths: ['src/Commands/*.ts'],
});
```

### What happens when this is enabled

- Command files are watched for changes
- Modified commands are reloaded automatically
- The CLI updates without a manual restart

### When to use it

- Local development
- Building or iterating on commands
- Debugging command behavior

### When **not** to use it

- Production environments
- One-off CLI executions
- Performance-sensitive workflows

> `allowRebuilds` is a development convenience, not a runtime feature.
> Disable it in production to avoid unnecessary filesystem watchers.

## Fluent Initialization (Kernel API)

Musket CLI supports a fluent, programmatic initialization flow for cases where the default config-based bootstrap isn’t flexible enough. This approach gives you full control over the Kernel lifecycle, allowing you to configure discovery, packages, and commands explicitly at runtime.

This mode is ideal for advanced use cases such as embedded CLIs, test environments, monorepos, or dynamic command registration.

### Package configuration behavior

::: warning Package configuration
When the `Kernel` is initialized programmatically, the `packages` property defined in your config file is **ignored**.
This is intentional. Once you opt into manual kernel control, Musket assumes you want **explicit ownership** of package registration.
To register packages in this mode, you **must** use `setPackages()`.
:::

### Example: Fluent kernel bootstrap

```ts
import { Kernel } from 'h3ravel/musket';
import { TestCommand, Application } from './Example';

const app = new Application();

const instance = new Kernel(app)
  .setCwd(process.cwd())
  .setConfig({
    name: 'musket-cli',
    discoveryPaths: [path.join(process.cwd(), 'tests/Commands/*.ts')],
  })
  .setPackages([
    { name: '@h3ravel/shared', alias: 'Shared PKG' },
    '@h3ravel/support',
  ])
  .registerCommands([TestCommand])
  .bootstrap();

return await instance.run();
```

### API breakdown

- **`setCwd(cwd: string)`**
  Sets the working directory used by the CLI runtime.

- **`setConfig(config: KernelConfig)`**
  Provides runtime configuration directly, bypassing file-based resolution.

- **`setPackages(packages: (string | { name: string, alias: string })[])`**
  Registers packages explicitly.
  **Required** when using fluent initialization.

- **`registerCommands(commands: Command[])`**
  Registers command classes directly on the kernel.

- **`bootstrap()`**
  Finalizes kernel setup. Must be called before `run()`.

- **`run()`**
  Executes the CLI.

### Notes

- Fluent initialization bypasses config file `package` loading.
- Call `bootstrap()` before `run()`.
- Prefer config-based initialization for standard setups.
