# Writing Commands

Beyond the built-in commands, Musket lets you define your own custom commands.
By convention, commands are stored in `src/app/Console/Commands`, though you can choose a different directory and configure H3ravel to scan it for commands (**WIP**).

## Generating Commands (H3ravel Only) [WIP]

To generate a new command, use the `make:command` command. This creates a new command class in `src/app/Console/Commands`.
If the directory doesn’t exist, it will be created automatically:

::: code-group

```sh [npx]
$ npx musket make:command SendEmails
```

```sh [npm]
$ npm musket make:command SendEmails
```

```sh [yarn]
$ yarn musket make:command SendEmails
```

```sh [pnpm]
$ pnpm musket make:command SendEmails
```

```sh [bun]
$ bun musket make:command SendEmails
```

:::

## Command Structure

Each musket command must define the `signature` and `description` properties, these are displayed when listing available commands.

The `signature` property also specifies the [expected input](#command-signature) for the command.

The `handle()` method contains the logic that runs when your command is executed.
Dependencies declared in this method are automatically injected by H3ravel’s [Service Container](/guide/architecture/container).

**Example:**

```ts
import { Command } from '@h3ravel/console';
import { Injectable } from '@h3ravel/core';
import { User } from 'App/Models/User';
import { ExampleMail } from 'App/Mail/ExampleMail';

export class SendEmails extends Command {
  /**
   * The name and signature of the console command.
   */
  protected signature = 'mail:send {user}';

  /**
   * The console command description.
   */
  protected description = 'Send a marketing email to a user';

  /**
   * Execute the console command.
   */
  @Injectable()
  public async handle(mail: ExampleMail): Promise<void> {
    await mail.send(User.query().find(this.argument('user')));
  }
}
```

> 💡 **Tip:** Keep commands lightweight — delegate complex logic to dedicated service classes or modules. In the example above, the heavy lifting of sending emails is handled by a separate mail service.

## Exit Codes

When the `handle()` method completes successfully without returning anything, Musket exits with code **0** (success).

To manually control the exit code, you can call `process.exit()`:

```ts
this.error('Something went wrong.');
process.exit(1);
```

Alternatively, use the `fail()` method to stop execution and exit with code **1**:

```ts
this.fail('Something went wrong.');
```

## Closure Commands [WIP]

Musket will soon support closure-based commands, allowing quick command definitions without creating full class files.

## Command Signature

Commands often need input from the user — either through **arguments** or **options**.
You can define these expectations directly in the command’s `signature` property using an expressive, route-like syntax.

For example:

```ts
protected signature = 'user:create {name} {--admin}';
```

This defines a command named `user:create` that accepts a `name` argument and an optional `--admin` flag.

## Basic Examples

| Type                    | Example                                                      | Description                 |
| ----------------------- | ------------------------------------------------------------ | --------------------------- |
| **Basic Command**       | `'my:command'`                                               | Simple command name         |
| **Arguments**           | `'user:create {name}'`                                       | Required argument           |
| **Optional Arguments**  | `'user:create {name} {email?}'`                              | Optional argument           |
| **With Descriptions**   | `'user:create {name : The user name} {email? : User email}'` | Adds inline docs            |
| **Boolean Flags**       | `'user:create {name} {--admin : Make user an admin}'`        | Option without value        |
| **Options with Values** | `'backup:create {--format=zip : Backup format}'`             | Option that expects a value |
| **Shortcuts**           | `'serve:start {--p\|port=3000 : Port number}'`               | Option aliases              |

## Complex Signature Example

```ts
protected signature = `user:create
  {name : The user name}
  {email? : Optional email address}
  {--admin : Grant admin privileges}
  {--role=user : Set user role}
  {--f|force : Skip confirmation}`;
```

## Namespaced Commands

Namespaced commands can be created by adding a colon (`:`) after the command name (namespace) and proceeding to define the rest commands with `{` and `}`. Namespaced commands allow you to define multiple commands in one class and is usefull for creating commands that share a common source of truth.

```ts
protected signature = `cache:
  {clear : Clear all cached data}
  {flush : Flush entire cache}
  {warm : Warm up the cache}
  {^--store=default : Cache store name}`;
```

The above example will create `4` different Musket commands scoped under the `cache` namespace, they'll be `cache:clear`, `cache:flush`, `cache:warm` and `cache`, they will all share the `--store` option and can each define their own signatures.

If you do not wish to create an additional command for the namespace you can add a hash (`#`) before the namespace:

```ts
protected signature = `#cache:
  {clear : Clear all cached data}
  {flush : Flush entire cache}
  {warm : Warm up the cache}
  {^--store=default : Cache store name}`;
```

The example below demostrates how to handle namespaced commands.

```ts
import { Command } from '@h3ravel/console';

export class CacheCommand extends Command {
  protected signature = `cache:
    {clear : Clear all cached data}
    {flush : Flush entire cache store}
    {warm : Warm up the cache}
    {--store=default : Cache store name}`;

  protected description = 'Manage application cache';

  public async handle(): Promise<void> {
    const action = this.dictionary.name || this.dictionary.baseCommand;

    switch (action) {
      case 'clear':
        return this.clearCache();
      case 'flush':
        return this.flushCache();
      case 'warm':
        return this.warmCache();
      default:
        this.fail(`Unknown action: ${action}`);
    }
  }
}
```

### Sub Command Signature

When you define a namespaced command, you may use a pipe character (`|`) to separate all of the sub commands signature

```ts
protected signature: string = `#make:
    {migration : Generates a new database migration class.
        | {--t|table : The table to migrate}
        | {--c|create : The table to be created}
        | {--l|type=ts : The file type to generate}
    }
    {factory : Create a new model factory.
        | {--force : Create the factory even if it already exists}
        | {--l|type=ts : The file type to generate}
    }
```

## Description & Logic

The `description` property appears when listing commands with `npx musket list`.

The `handle()` method holds your command logic. You can access arguments and options, interact with users, write output messages and even bind services to be resolved by the service container:

```ts
public async handle(): Promise<void> {
  const name = this.argument('name');
  const isAdmin = this.option('admin');

  this.info(`Creating user ${name}...`);
  this.success('User created successfully!');
}
```

## Defining Input Expectations

When building CLI commands, you’ll often need to receive user input — either as **arguments** or **options**. Musket makes this process simple and expressive through the `signature` property.
This property defines the command name, its arguments, and its options in a concise, route-like syntax.

> **Tip:** The `signature` provides a declarative way to describe all expected inputs in a single place.

### Arguments

Arguments represent ordered values passed to the command.
Each argument is defined within curly braces.

For example, this command defines one required argument named `user`:

```ts
protected signature = 'mail:send {user}';
```

You can make arguments optional or assign default values directly in the signature:

```ts
// Optional argument
'mail:send {user?}';

// Optional argument with a default value
'mail:send {user=foo}';
```

### Options

Options are name-based inputs, prefixed by two hyphens (`--`) when used from the terminal.
They come in two main types:

- **Switch options** — act as simple boolean flags.
- **Valued options** — expect a specific value.

Example of a boolean switch:

```ts
protected signature = 'mail:send {user} {--queue}';
```

If `--queue` is passed, its value is `true`; otherwise, it’s `false`.

::: code-group

```sh [npx]
$ npx musket mail:send 1 --queue
```

```sh [npm]
$ npm musket mail:send 1 --queue
```

```sh [yarn]
$ yarn musket mail:send 1 --queue
```

```sh [pnpm]
$ pnpm musket mail:send 1 --queue
```

```sh [bun]
$ bun musket mail:send 1 --queue
```

:::

#### Options With Values

To specify that an option expects a value, add an equals sign (`=`):

```ts
protected signature = 'mail:send {user} {--queue=}';
```

Example usage:

::: code-group

```sh [npx]
$ npx musket mail:send 1 --queue=default
```

```sh [npm]
$ npm musket mail:send 1 --queue=default
```

```sh [yarn]
$ yarn musket mail:send 1 --queue=default
```

```sh [pnpm]
$ pnpm musket mail:send 1 --queue=default
```

```sh [bun]
$ bun musket mail:send 1 --queue=default
```

:::

If the option is not specified, its value defaults to `null`.
You may also define a fallback directly in the signature:

```ts
'mail:send {user} {--queue=default}';
```

#### Option Shortcuts

You can assign short aliases for frequently used options by separating them with a pipe (`|`):

```ts
'mail:send {user} {--Q|queue}';
```

Example usage:

::: code-group

```sh [npx]
$ npx musket mail:send 1 -Qdefault
```

```sh [npm]
$ npm musket mail:send 1 -Qdefault
```

```sh [yarn]
$ yarn musket mail:send 1 -Qdefault
```

```sh [pnpm]
$ pnpm musket mail:send 1 -Qdefault
```

```sh [bun]
$ bun musket mail:send 1 -Qdefault
```

:::

### Input Arrays

When you want to accept multiple values for an argument or option, use an asterisk (`*`) after the name.

Example of a multi-value argument:

```ts
'mail:send {user*}';
```

::: code-group

```sh [npx]
$ npx musket mail:send 1 2
```

```sh [npm]
$ npm musket mail:send 1 2
```

```sh [yarn]
$ yarn musket mail:send 1 2
```

```sh [pnpm]
$ pnpm musket mail:send 1 2
```

```sh [bun]
$ bun musket mail:send 1 2
```

:::

The `user` argument will resolve as an array: `['1', '2']`.

You can also combine the optional (`?`) and array (`*`) markers to allow zero or more inputs:

```ts
'mail:send {user?*}';
```

### Option Arrays

Options can also accept multiple values using the same pattern:

```ts
'mail:send {--id=*}';
```

Usage example:

::: code-group

```sh [npx]
$ npx musket mail:send --id=1 --id=2
```

```sh [npm]
$ npm musket mail:send --id=1 --id=2
```

```sh [yarn]
$ yarn musket mail:send --id=1 --id=2
```

```sh [pnpm]
$ pnpm musket mail:send --id=1 --id=2
```

```sh [bun]
$ bun musket mail:send --id=1 --id=2
```

:::

### Input Descriptions

You can attach short descriptions to arguments or options by separating the name and description with a colon (`:`).
Longer signatures can be split across multiple lines for readability:

```ts
protected signature = `mail:send
  {user : The ID of the user}
  {--queue : Whether the job should be queued}
`;
```

### Input Choices

You may also provide a list of allowed choices for arguments or options by separating the name and choices with a colon (`:`).

```ts
protected signature = `mail:send
  {user : The ID of the user}
  {--driver : The driver to send this mail with : smtp,sendgrid,ses,mailhog}
`;
```

To use choices, a description is required, however, you may separate your options or arguments and choices with two space separatated colons (`: :`) where there is no dscription.

```ts
protected signature = `mail:send
  {user : The ID of the user}
  {--driver : : smtp,sendgrid,ses,mailhog}
`;
```

For clarity, you may also define your choices using the array syntax `{--driver : : [smtp,sendgrid,ses,mailhog]}`.

## Command Input & Output

### Retrieving Input

To access the user’s input during command execution, Musket provides simple helpers.

Use `argument(name)` to fetch a single argument. If it doesn’t exist, `null` is returned:

```ts
/**
 * Execute the console command.
 */
public async handle(): Promise<void> {
  const userId = this.argument('user');
}
```

To get all arguments as an object:

```ts
const args = this.arguments();
```

Similarly, `option(name)` retrieves a specific option, while `options()` returns them all:

```ts
// Retrieve one option
const queueName = this.option('queue');

// Retrieve all options
const opts = this.options();
```

### Prompting for Input

> **WIP:** Interactive prompts are being refined for next release.

Musket can request live input from users during execution.

To ask a question and receive a response:

```ts
public async handle(): Promise<void> {
  const name = await this.ask('What is your name?');
}
```

You can also specify a default fallback:

```ts
const name = await this.ask('What is your name?', 'Legacy');
```

For sensitive information (like passwords), use `secret()`, which hides user input as they type:

```ts
const password = await this.secret('Enter your password:');
```

### Asking for Confirmation

> **WIP:** Confirmation prompts are in testing.

Use `confirm()` for simple yes/no decisions.
It returns `true` if the user types “y” or “yes”:

```ts
if (await this.confirm('Do you wish to continue?')) {
  // Proceed
}
```

You can also set a default `true` response:

```ts
if (await this.confirm('Proceed with installation?', true)) {
  // Continues automatically if no input
}
```

### Auto-Completion

> **WIP:** Auto-complete support for command inputs is in progress.

The `anticipate()` method provides suggestions as the user types:

```ts
const name = await this.anticipate('What is your name?', ['Legacy', 'Kaylah']);
```

You can also supply a dynamic suggestion callback:

```ts
const address = await this.anticipate(
  'What is your address?',
  async (input) => {
    return await Address.query()
      .whereLike('name', `${input}%`)
      .limit(5)
      .pluck('name');
  }
);
```

### Multiple Choice Questions

> **WIP:** Multiple-choice inputs currently under integration.

The `choice()` method restricts input to predefined options.
You can specify a default selection by index:

```ts
const name = await this.choice('What is your name?', ['Legacy', 'Kaylah'], 0);
```

Allow multiple selections or limit attempts:

```ts
const selected = await this.choice(
  'Select your favorite languages:',
  ['JavaScript', 'TypeScript', 'Go', 'Rust'],
  0,
  3,
  true
);
```

> **Tip:** When a prompt receives no response:
>
> - `ask()` returns its default (or exits if none).
> - `confirm()` uses its default choice.
> - `choice()` returns the default option.
> - `anticipate()` returns its default value.

### Writing Output

Commands can output messages to the console using several convenience methods:
`line`, `debug`, `newLine`, `info`, `success`, `comment`, `question`, `warn`, `alert`, `error`, and `fail`.
Each applies context-appropriate colors and formatting automatically.

For example, to display general information:

```ts
this.info('The command was successful!');
```

Display an error message:

```ts
this.error('Something went wrong!');
```

Output plain text without color:

```ts
this.line('Display this on the screen');
```

Insert blank lines for spacing:

```ts
// One blank line
this.newLine();

// Three blank lines
this.newLine(3);
```

> **Tip:** Output methods automatically handle line breaks and ANSI colorization for a clean display across terminals.

```ts
this.alert('Loading Interupted'); // WIP
this.info('Informational message');
this.success('Operation completed');
this.warn('Low disk space');
this.error('Failed to connect');
this.line('Plain text');
this.comment('A simple comment'); // WIP
this.question('Is this your final build?'); // WIP
this.newLine();
this.debug('Debug details'); // Only visible with --verbose 3
this.fail('And error uccured'); // Will call this.error() and exit the command
```

#### Output Behavior by Verbosity

| Method      | Default | `--quiet` | `--silent` | `--verbose 3` |
| ----------- | ------- | --------- | ---------- | ------------- |
| `info()`    | ✓       | ✗         | ✗          | ✓             |
| `success()` | ✓       | ✗         | ✗          | ✓             |
| `warn()`    | ✓       | ✓         | ✗          | ✓             |
| `error()`   | ✓       | ✓         | ✗          | ✓             |
| `debug()`   | ✗       | ✗         | ✗          | ✓             |
| `line()`    | ✓       | ✓         | ✗          | ✓             |

#### Verbosity Helpers

```ts
const level = this.getVerbosity(); // 0–3
if (this.isQuiet()) { ... }
if (this.isSilent()) { ... }
if (this.isNonInteractive()) { ... }
```

## Advanced Output (Logger)

For advanced layouts and colored messages, use the [`Logger`](#) class from `@h3ravel/shared`:

```ts
import { Logger } from '@h3ravel/shared';

Logger.info('Processing...');
Logger.twoColumnDetail('Task', 'DONE');
Logger.success('Operation completed');

Logger.log([
  ['Processed', 'white'],
  ['100 items', ['green', 'bold']],
  ['successfully', 'white'],
]);

Logger.log('Job completed successfully', 'green');
```

### Tables [WIP]

The `table` method makes it easy to correctly format multiple rows / columns of data. All you need to do is provide the column names and the data for the table and Laravel will automatically calculate the appropriate width and height of the table for you:

```ts
import { User } from 'App/Models/User';

this.table(
    ['Name', 'Email'],
    User.query().all(['name', 'email'])->toArray()
);
```

### Progress Bars [WIP]

For long running tasks, it can be helpful to show a progress bar that informs users how complete the task is. Using the withProgressBar method, Laravel will display a progress bar and advance its progress for each iteration over a given iterable value:

```ts
import { User } from 'App/Models/User';

const users = this.withProgressBar(User.query().all(), (user: User) => {
  this.performTask(user);
});
```

Sometimes, you may need more manual control over how a progress bar is advanced. First, define the total number of steps the process will iterate through. Then, advance the progress bar after processing each item:

```ts
import { User } from 'App/Models/User';

const users = User.query().all();

const bar = this.output.createProgressBar(users.length);

bar.start();

users.forEach((user) => {
  this.performTask(user);
  bar.advance();
});

bar.finish();
```

## Command Registration

### Auto-Discovery

By default, H3ravel automatically registers all commands within the `src/app/Console/Commands` directory. However, you can instruct H3ravel to scan other directories for Musket commands using the `withCommands` method in your application's `src/bootstrap/app.ts` file:

```ts
import path from 'node:path';

app.withCommands([path.join(process.cwd(), '../app/Bookers/Build/Commands')]);
```

If necessary, you may also manually register commands by providing the command's class name to the withCommands method:

```ts
import { SendEmails } from 'Bookers/Build/SendEmails';

app.withCommands([SendEmails]);
```

You can also register commands within the `boot` or `register` methods of a service provider

```ts
import { ServiceProvider } from '@h3ravel/core';
import { MyCommand } from 'App/Console/Commands/MyCommand';

export class CommandServiceProvider extends ServiceProvider {
  public async register(): Promise<void> {
    this.registerCommands([MyCommand]);
  }
}
```

When Musket CLI boots, all the commands in your application will be resolved by the service container and registered with Artisan.

### Built-In Commands

When used in H3ravel, Musket ships with a number of useful command utilities to help you achieve repetitive tasks

- `make:*` – Code generators
- `migrate:*` – Database migration tools
- `fire` – Dev server runner
- `storage:link` – Create storage symlinks
- `list` – Show all commands

You can run `npx musket list` to get a full list of all availabel commands

## Running Commands

### Development

::: code-group

```sh [npx]
$ npx musket my:command
$ npx musket user:create "John Doe"
$ npx musket user:create "Jane" --admin --role=moderator
$ npx musket serve:start --p=8080
$ npx musket help user:create
```

```sh [npm]
$ npm musket my:command
$ npm musket user:create "John Doe"
$ npm musket user:create "Jane" --admin --role=moderator
$ npm musket serve:start --p=8080
$ npm musket help user:create
```

```sh [yarn]
$ yarn musket my:command
$ yarn musket user:create "John Doe"
$ yarn musket user:create "Jane" --admin --role=moderator
$ yarn musket serve:start --p=8080
$ yarn musket help user:create
```

```sh [pnpm]
$ pnpm musket my:command
$ pnpm musket user:create "John Doe"
$ pnpm musket user:create "Jane" --admin --role=moderator
$ pnpm musket serve:start --p=8080
$ pnpm musket help user:create
```

```sh [bun]
$ bun musket my:command
$ bun musket user:create "John Doe"
$ bun musket user:create "Jane" --admin --role=moderator
$ bun musket serve:start --p=8080
$ bun musket help user:create
```

:::

### Global Options

#### Verbosity

::: code-group

```sh [npx]
npx musket my:command --quiet
npx musket my:command --silent
npx musket my:command --verbose 3
```

```sh [npm]
npm musket my:command --quiet
npm musket my:command --silent
npm musket my:command --verbose 3
```

```sh [yarn]
yarn musket my:command --quiet
yarn musket my:command --silent
yarn musket my:command --verbose 3
```

```sh [pnpm]
pnpm musket my:command --quiet
pnpm musket my:command --silent
pnpm musket my:command --verbose 3
```

```sh [bun]
bun musket my:command --quiet
bun musket my:command --silent
bun musket my:command --verbose 3
```

:::

#### Non-Interactive

::: code-group

```sh [npx]
npx musket my:command --no-interaction
```

```sh [npm]
npm musket my:command --no-interaction
```

```sh [yarn]
yarn musket my:command --no-interaction
```

```sh [pnpm]
pnpm musket my:command --no-interaction
```

```sh [bun]
bun musket my:command --no-interaction
```

:::

#### Combined Examples

::: code-group

```sh [npx]
npx musket migrate:run --quiet --no-interaction
npx musket cache:clear --silent
npx musket my:command --verbose 3
```

```sh [npm]
npm musket migrate:run --quiet --no-interaction
npm musket cache:clear --silent
npm musket my:command --verbose 3
```

```sh [yarn]
yarn musket migrate:run --quiet --no-interaction
yarn musket cache:clear --silent
yarn musket my:command --verbose 3
```

```sh [pnpm]
pnpm musket migrate:run --quiet --no-interaction
pnpm musket cache:clear --silent
pnpm musket my:command --verbose 3
```

```sh [bun]
bun musket migrate:run --quiet --no-interaction
bun musket cache:clear --silent
bun musket my:command --verbose 3
```

:::
**Precedence:**

1. `--silent` overrides all
2. `--quiet` suppresses info/success
3. `--verbose` increases output detail

## Best Practices

### Command Design

- **Be specific:** Focus on a single purpose
- **Be descriptive:** Use namespaced identifiers like `user:create`
- **Be consistent:** Follow common signature patterns

```ts
// Clear and focused
export class CreateUserCommand extends Command {
  protected signature = 'user:create {name} {--admin}';
  protected description = 'Create a new user account';
}
```

### Error Handling

Gracefully handle failures and provide meaningful feedback:

```ts
try {
  await this.performTask();
  this.success('Task completed successfully');
} catch (error) {
  if (error.code === 'ENOENT') {
    this.error('Config file missing. Run `npx musket init` first.');
    return;
  }
  this.debug(error.message);
  this.error('Operation failed. Use --verbose for details.');
}
```

### Input Validation

```ts
const name = this.argument('name');
if (!name?.trim()) return this.error('Name is required');

const email = this.option('email');
if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  return this.error('Invalid email format');

await this.createUser(name, email);
```
