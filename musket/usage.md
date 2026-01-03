# Basic Usage

## Creating Commands

Commands in Musket extend the base `Command` class and define a **signature** and **handle()** method.

Example:

```ts
import { Command } from '@h3ravel/musket';

export default class GreetCommand extends Command {
  protected signature = 'greet {name}';
  protected description = 'Display a personalized greeting.';

  async handle() {
    const name = this.argument('name');
    this.info(`Hello, ${name}!`);
  }
}
```

If your project uses discovery paths (via `discoveryPaths`),
this command will be automatically registered.

Otherwise, you can manually register it in your application:

```ts
app.registeredCommands = [GreetCommand];
await Kernel.init(app);
```

## Running Commands

Once your CLI is compiled or built, you can run commands via:

```bash
node dist/cli.js greet Legacy
```

Output:

```
Hello, Legacy!
```

Musket automatically provides helpful flags:

- `-h` / `--help` for command help
- `-V` for version and package info
- `--quiet`, `--silent`, and `--non-interactive` for controlling verbosity

## Command Features

Musket commands provide:

- **Arguments and options** using Artisan-style syntax (`command {arg} {--option}`).
- **Namespaces** with colon notation (`make:command`).
- **Colored output helpers**:

  - `this.info(message)`
  - `this.warn(message)`
  - `this.success(message)`
  - `this.error(message)`
  - `this.debug(message)`

- **Verbosity control**:

  - `this.isQuiet()`, `this.isSilent()`, `this.isNonInteractive()`, `this.getVerbosity()`

- **Graceful failure handling**:

  - `this.fail('Message')` terminates execution with exit code `1`.

## Advanced Usage

### Manual Commander Access

To hook into the lifecycle of the underlying `commander` instance or register custom commands programmatically,
you must set `skipParsing` to `true` in your configuration.

Example:

```ts
const program = await Kernel.init(app, {
  skipParsing: true,
});

program
  .command('ping')
  .description('Simple connectivity test')
  .action(() => console.log('pong'));

program.parse(); // Run manually when ready
```

This allows complete control over parsing, event handling, and custom command definitions.

### Command Discovery

Musket can automatically discover and register commands from one or more directories using glob patterns.

```ts
await Kernel.init(app, {
  discoveryPaths: [
    path.join(process.cwd(), 'src/Console/Commands/*.ts'),
    path.join(process.cwd(), 'app/Commands/*.js'),
  ],
});
```

Every file exporting a class that extends `Command` will be loaded and registered automatically.

### Programmatic Rebuilds

You can trigger a rebuild of a particular command or the entire CLI programmatically:

```ts
await app.musket.rebuild('make:command');
```

This is particularly useful in development environments where commands are dynamically generated or changed.
