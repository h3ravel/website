# Kernel Instance Methods

The `Kernel` class is the core runtime container for Musket CLI. It manages the application context, registered commands, working directory, and metadata exposed via CLI flags.

```ts
import { Kernel } from 'h3ravel/musket';
import { TestCommand, Application } from './Example';

const app = new Application();
const kernel = new Kernel(app);
```

## `Kernel.init(app, config?)`

```ts
static async init<A extends Application>(
  app: A,
  config: KernelConfig = {}
): Promise<Command | number>
```

Bootstraps and runs Musket CLI in one call.

This is the **recommended entry point** for most Musket-powered CLIs. It wires everything together in the correct order and starts command parsing immediately.

### What it does (in order)

1. Creates a new `Kernel` instance
2. Applies CLI configuration
3. Registers version packages from config
4. Bootstraps the CLI
5. Runs the CLI IO

### Equivalent to

```ts
await new Kernel(app)
  .setConfig(config)
  .setPackages(config.packages ?? [])
  .bootstrap()
  .run();
```

### Example

```ts
import { Kernel } from 'h3ravel/musket';
import { Application } from './app';

await Kernel.init(new Application(), {
  name: 'Musket CLI',
});
```

## `setCwd(cwd)`

```ts
setCwd(cwd: string): this
```

Manually sets the current working directory for Musket.

This affects path resolution and any filesystem-related operations performed by commands.

### Notes

- Defaults to `process.cwd()`
- Chainable

### Example

```ts
kernel.setCwd('/usr/project');
```

## `getCwd()`

```ts
getCwd(): string
```

Returns the current working directory Musket is operating from.

### Use case

- Resolving relative paths
- Reading config or project files
- Debugging execution context

### Example

```ts
const cwd = kernel.getCwd();
console.log(cwd);
```

## `setPackages(packages)`

```ts
setPackages(packages: PackageMeta): this
```

Defines the npm packages that should be displayed when the `-V` / `--version` flag is passed to the CLI.

Each entry can be either:

- A **string** → treated as the name of an installed npm package
- An **object** → allows providing an alias for display purposes

Musket will resolve each package from `node_modules`, read its `package.json`, and display its version.

### Package resolution rules

- `name` **must** be a resolvable, installed npm package
- `alias` (when provided) replaces the package name in the `-V` output
- If only a string is provided, the string is used as both the resolver and display name

### Notes

- Order is preserved in the `-V` output
- Overrides any previously set packages
- Chainable

### Examples

**Basic usage**

```ts
kernel.setPackages(['musket', 'h3ravel']);
```

**Using aliases**

```ts
kernel.setPackages([
  { name: '@h3ravel/core', alias: 'framework' },
  { name: '@h3ravel/musket', alias: 'cli' },
]);
```

**Mixed format**

```ts
kernel.setPackages(['node', { name: '@h3ravel/core', alias: 'core' }]);
```

**Example `-V` output**

```
cli        1.2.0
core       0.9.4
node       v20.10.0
```

## `getPackages()`

```ts
getPackages(): PackageMeta[]
```

Returns the currently configured packages that will be displayed with the `-V` flag.

### Example

```ts
const packages = kernel.getPackages();

/*
[
  { name: '@h3ravel/core', alias: 'framework' },
  { name: '@h3ravel/musket', alias: 'cli' },
]
*/
```

## `setConfig(config)`

```ts
setConfig(config: KernelConfig): this
```

Sets the configuration object used by Musket CLI.

This includes metadata such as name, version, description, packages, flagsUnlocking CLI features.

### Notes

- Overrides the existing config
- Chainable

### Example

```ts
kernel.setConfig({
  name: 'musket',
  version: '1.0.0',
});
```

## `getConfig()`

```ts
getConfig(): KernelConfig
```

Returns the current CLI configuration.

### Example

```ts
const config = kernel.getConfig();
```

## `registerCommands(commands)`

```ts
registerCommands(commands: typeof Command[]): this
```

Registers one or more command classes with the kernel.

Commands are stored internally and later passed to commander during parsing.

### Notes

- Uses a `Set` internally (duplicates are ignored)
- Chainable
- Registration order is preserved

### Example

```ts
kernel.registerCommands([BuildCommand, TestCommand]);
```

## `getRegisteredCommands()`

```ts
getRegisteredCommands(): typeof Command[]
```

Returns all commands currently registered with the kernel.

Useful for introspection, debugging, or custom help output.

### Example

```ts
const commands = kernel.getRegisteredCommands();
```

## `registerDiscoveryPath(paths)`

```ts
registerDiscoveryPath(paths: string[]): this
```

Adds one or more filesystem paths to Musket’s command discovery configuration.

This method appends new paths to the existing `discoveryPaths` config, allowing Musket to automatically locate and register command classes without manual wiring.

### Behavior

- Accepts an array of glob or directory paths
- Preserves previously defined discovery paths
- Normalizes single or multiple existing values into an array
- Updates `config.discoveryPaths` in place
- Chainable

### When to use it

- Extending discovery paths from plugins or providers
- Registering commands conditionally
- Avoiding hard-coded discovery paths in the initial config

### Example

```ts
kernel.registerDiscoveryPath(['src/Commands/*.ts', 'packages/*/Commands/*.ts']);
```

> Discovery paths are consumed during bootstrapping.
> Call this method **before** `bootstrap()` or `run()` for it to take effect.

## `bootstrap()`

```ts
bootstrap(): this
```

Prepares the CLI for execution.

This is where Musket performs internal setup before parsing commands (bindings, hooks, extensions, etc.).

### Notes

- Must be called before `run()`
- Automatically handled when using `Kernel.init()`
- Chainable

### Example

```ts
kernel.bootstrap().run();
```

## `run(returnExit?)`

```ts
async run<E extends boolean = false>(
  returnExit?: E
): Promise<E extends true ? number : Command>
```

Runs the CLI input/output cycle and parses commands using **commander.js**.

### Parameters

- `returnExit` (optional)

  - `false` (default) → returns the current `Command` instance
  - `true` → returns the process exit code instead of exiting

### Returns

- `Command` → the active commander.js instance
- `number` → exit code (when `returnExit` is `true`)

### Use cases

- Programmatic CLI execution
- Testing without `process.exit`
- Inspecting the commander instance

### Example

```ts
const command = await kernel.run();
```

```ts
const exitCode = await kernel.run(true);
```
