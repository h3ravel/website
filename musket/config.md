# Configuration

You can customize Musket’s behavior by passing a configuration object to `Kernel.init()`:

```ts
import path from 'path';
import { Kernel } from '@h3ravel/musket';

await Kernel.init(app, {
  cliName: 'mycli',
  packages: ['@h3ravel/support', '@h3ravel/shared'],
  discoveryPaths: [path.join(process.cwd(), 'src/Commands/*.ts')],
});
```

### Available Configuration Options

| Option             | Type                                                  | Default     | Description                                                                                                                                                           |
| ------------------ | ----------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **logo**           | `string`                                              | `undefined` | ASCII art-style logo to display at startup.                                                                                                                           |
| **cliName**        | `string`                                              | `'musket'`  | The name of the CLI application, used in help text and display.                                                                                                       |
| **skipParsing**    | `boolean`                                             | `false`     | If `true`, Musket will not automatically parse command-line input. This is required if you want to manually control or hook into the underlying `commander` instance. |
| **resolver**       | `<X extends Command>(cmd: X, met: any) => Promise<X>` | `undefined` | A callback that resolves the `handle` method for commands dynamically. Useful for dependency injection or lazy loading of commands.                                   |
| **tsDownConfig**   | `Options`                                             | `undefined` | Configuration for Musket’s internal TypeScript compilation process, used when invoking programmatic builds.                                                           |
| **packages**       | `(string\|{ name: string; alias: string })[]`         | `[]`        | Packages to display when the `-V` flag is used, typically related H3ravel packages.                                                                                   |
| **hideMusketInfo** | `boolean`                                             | `false`     | If `true`, suppresses automatic Musket name and version info in console output.                                                                                       |
| **baseCommands**   | `typeof Command[]`                                    | `[]`        | A list of command classes to preload into the CLI without discovery.                                                                                                  |
| **discoveryPaths** | `string\|string[]`                                    | `[]`        | One or more glob paths where Musket should search and automatically register command files (e.g. `'src/Console/Commands/*.ts'`).                                      |
| **allowRebuilds**  | `boolean`                                             | `false`     | If `true`, commands and CLI structures will rebuild automatically when code changes are detected.                                                                     |
| **rootCommand**    | `typeof Command`                                      | `undefined` | The command to run when the CLI is executed without any arguments                                                                                                     |

### Examples: `allowRebuilds` and `rootCommand`

#### Automatic Rebuilds on Code Changes

Enabling `allowRebuilds` lets Musket automatically reload commands or rebuild internal structures whenever code changes. This is useful during development:

```ts
import { Kernel } from '@h3ravel/musket';
import { Application } from './Application';

const app = new Application();

await Kernel.init(app, {
  allowRebuilds: true,
  discoveryPaths: ['src/Commands/*.ts'],
});
```

With this enabled, Musket will detect changes in your command files and reload them without restarting the CLI manually.

#### Default Root Command

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
