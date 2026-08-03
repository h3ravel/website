# Get Started

## Initialization

Musket requires an application instance that extends its base `Application` class.

```ts
import { Application as BaseApplication, Kernel } from '@h3ravel/musket';

class Application extends BaseApplication {}

const app = new Application();

await Kernel.init(app);
```

`Kernel.init()` is the recommended way to start Musket. It binds the Musket instance to the application, registers available commands, bootstraps the CLI, and handles command-line input.

After initialization, the Musket instance is available through `app.musket`:

```ts
await Kernel.init(app);

console.log(app.musket);
```

### Initializing with configuration

Pass a configuration object as the second argument to customize the CLI:

```ts
import path from 'node:path';
import { Application as BaseApplication, Kernel } from '@h3ravel/musket';

class Application extends BaseApplication {}

const app = new Application();

await Kernel.init(app, {
  name: 'mycli',
  packages: ['@h3ravel/support', '@h3ravel/shared'],
  discoveryPaths: [path.join(process.cwd(), 'src/Commands/*.ts')],
});
```

This configuration:

- Sets the CLI name used in help output and usage instructions
- Defines the packages shown when `-V` or `--version` is passed
- Automatically discovers and registers commands from the configured paths

For most applications, this is all the initialization Musket needs.

## Application Lifecycle

The application constructor runs before Musket is attached, so `this.musket` should not be accessed from the constructor.

Use `registerMusketListeners()` when you need access to the Musket instance during application startup:

```ts
import { Application as BaseApplication, Musket } from '@h3ravel/musket';

export class Application extends BaseApplication {
  protected registerMusketListeners(musket: Musket<this>): void {
    console.log('Musket has been attached', musket);
  }
}
```

This method is called after Musket has been attached to the application. Application properties and services are also available inside the method:

```ts
export class Application extends BaseApplication {
  logger = console;

  protected registerMusketListeners(musket: Musket<this>): void {
    musket.listen('handling', ({ command }) => {
      this.logger.log(`Handling ${command.constructor.name}`);
    });
  }
}
```

See the [events guide](./events.md) for command lifecycle events and listener registration.

## Configuration

The configuration object controls how the CLI is identified, which commands it registers, and how it behaves at startup.

Use it to:

- Set the CLI name, version, and logo
- Configure package version output
- Register commands directly or through automatic discovery
- Customize command resolution and exception handling
- Control parsing and development rebuilds

### Available Configuration Options

| Option               | Type                                                                                                               | Default     | Description                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **logo**             | `string`                                                                                                           | `undefined` | An ASCII-style logo displayed at startup.                                                                                                       |
| **name**             | `string`                                                                                                           | `'musket'`  | The CLI application name used in help text and other output.                                                                                    |
| **version**          | `string`                                                                                                           | `undefined` | The CLI version. When provided, it overrides the version resolved from the package configuration marked as the base package.                    |
| **skipParsing**      | `boolean`                                                                                                          | `false`     | Prevents Musket from automatically parsing command-line input. Use this when you need direct control over the underlying Commander.js instance. |
| **resolver**         | `<X extends Command>(cmd: X, met: any) => Promise<X>`                                                              | `undefined` | Resolves command methods dynamically. This is useful for dependency injection or custom command resolution.                                     |
| **tsDownConfig**     | `Options`                                                                                                          | `undefined` | Configuration passed to Musket's internal TypeScript build process during programmatic builds.                                                  |
| **packages**         | `(string \| { name?: string; alias?: string; label?: string; path?: string; version?: string; base?: boolean })[]` | `[]`        | Packages included in the output produced by the `-V` or `--version` option.                                                                     |
| **hideMusketInfo**   | `boolean`                                                                                                          | `false`     | Suppresses Musket's automatic name and version output when enabled.                                                                             |
| **baseCommands**     | `typeof Command[]`                                                                                                 | `[]`        | Command classes registered directly without automatic discovery.                                                                                |
| **discoveryPaths**   | `string \| string[]`                                                                                               | `[]`        | One or more glob paths Musket searches for command files, such as `'src/Console/Commands/*.ts'`.                                                |
| **allowRebuilds**    | `boolean`                                                                                                          | `false`     | Watches command sources and rebuilds the internal command registry when changes are detected.                                                   |
| **rootCommand**      | `typeof Command`                                                                                                   | `undefined` | The command executed when the CLI is run without command arguments.                                                                             |
| **exceptionHandler** | `(exception: Error) => void`                                                                                       | `undefined` | Receives caught exceptions and allows the application to handle or report them.                                                                 |

## Command Registration

Musket supports automatic command discovery and manual command registration.

### Automatic Discovery

Add one or more glob paths to `discoveryPaths` to let Musket discover command files automatically:

```ts
import path from 'node:path';
import { Kernel } from '@h3ravel/musket';

await Kernel.init(app, {
  discoveryPaths: [path.join(process.cwd(), 'src/Commands/*.ts')],
});
```

### Base Command List

Use `baseCommands` to register command classes directly during initialization:

```ts
import { Kernel } from '@h3ravel/musket';
import { Application } from './Application';
import { BuildCommand } from './Commands/BuildCommand';

const app = new Application();

await Kernel.init(app, {
  baseCommands: [BuildCommand],
});
```

You can also define commands through the application's `registeredCommands` property:

```ts
import { Application as BaseApplication, Kernel } from '@h3ravel/musket';
import { GreetCommand } from './Commands/GreetCommand';

class Application extends BaseApplication {
  registeredCommands = [GreetCommand];
}

const app = new Application();

await Kernel.init(app);
```

Use automatic discovery when commands follow a predictable directory structure. Use `baseCommands` or `registeredCommands` when you need explicit control over the registered command classes.

## Default Root Command

The `rootCommand` option defines the command executed when the CLI is run without command arguments:

```ts
import {
  Application as BaseApplication,
  Command,
  Kernel,
} from '@h3ravel/musket';

class Application extends BaseApplication {}

class DefaultCommand extends Command<Application> {
  protected signature = 'default';
  protected description = 'Runs when no arguments are provided';

  async handle(): Promise<void> {
    this.info('Welcome to Musket CLI! No arguments were passed.');
  }
}

const app = new Application();

await Kernel.init(app, {
  rootCommand: DefaultCommand,
});
```

Running the CLI without arguments:

```sh
node dist/cli.js
```

Produces:

```text
Welcome to Musket CLI! No arguments were passed.
```

## Automatic Rebuilds

During development, set `allowRebuilds` to `true` to watch command sources and rebuild Musket's internal command registry when files change:

```ts
import { Kernel } from '@h3ravel/musket';
import { Application } from './Application';

const app = new Application();

await Kernel.init(app, {
  allowRebuilds: true,
  discoveryPaths: ['src/Commands/*.ts'],
});
```

When enabled:

- Command files are watched for changes
- Modified commands are reloaded automatically
- The command registry is updated without manually restarting the CLI

Use this option for local development, command iteration, and debugging.

> `allowRebuilds` is a development convenience. Disable it in production and other performance-sensitive environments to avoid unnecessary filesystem watchers.

## Fluent Initialization

For most applications, `Kernel.init()` is the preferred initialization method. Use the fluent Kernel API when you need direct control over discovery, package registration, command registration, or the bootstrap lifecycle.

This approach is useful for embedded CLIs, test environments, monorepos, and applications that register commands dynamically.

```ts
import path from 'node:path';
import { Kernel } from '@h3ravel/musket';
import { Application } from './Application';
import { TestCommand } from './TestCommand';

const app = new Application();

const kernel = new Kernel(app)
  .setCwd(process.cwd())
  .setConfig({
    name: 'musket-cli',
    discoveryPaths: [path.join(process.cwd(), 'tests/Commands/*.ts')],
  })
  .setPackages([
    {
      name: '@h3ravel/shared',
      alias: 'Shared Package',
    },
    '@h3ravel/support',
  ])
  .registerCommands([TestCommand])
  .bootstrap();

await kernel.run();
```

### Package Configuration

::: warning Package configuration
When using fluent initialization, the `packages` property passed through `setConfig()` is ignored.

Register packages explicitly with `setPackages()` instead.
:::

```ts
kernel.setPackages(['@h3ravel/shared', '@h3ravel/support']);
```

### Kernel API

- **`setCwd(cwd: string)`**  
  Sets the working directory used by the CLI runtime.

- **`setConfig(config: KernelConfig)`**  
  Provides the runtime configuration directly.

- **`setPackages(packages: (string | { name: string; alias: string })[])`**  
  Registers packages explicitly. Use this instead of the `packages` configuration option during fluent initialization.

- **`registerCommands(commands: typeof Command[])`**  
  Registers command classes directly on the Kernel.

- **`bootstrap()`**  
  Finalizes the Kernel setup. Call this before `run()`.

- **`run()`**  
  Executes the CLI.

### Notes

- Prefer `Kernel.init()` for standard application setup.
- Use `setPackages()` to register packages during fluent initialization.
- Call `bootstrap()` before `run()`.
