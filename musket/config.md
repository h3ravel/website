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
