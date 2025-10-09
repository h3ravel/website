# Musket CLI

## Introduction

**Musket CLI** is a lightweight, framework-agnostic command-line framework for building **Artisan-style CLI applications**. It powers the command-line interface included with **H3ravel** and provides a collection of useful commands to streamline development.

By default, Musket CLI is installed with every H3ravel application. To see a list of all available commands, run:

```sh
npx musket list
```

Each command also includes a detailed **help screen** describing its available arguments and options. You can access it by prefixing the command name with `help`:

```sh
npx musket help migrate
```

## Writing Commands

Beyond the built-in commands, Musket lets you define your own custom commands.
By convention, commands are stored in `src/app/Console/Commands`, though you can choose a different directory and configure H3ravel to scan it for commands (**WIP**).

### Generating Commands [WIP]

To generate a new command, use the `make:command` command. This creates a new command class in `src/app/Console/Commands`.
If the directory doesn’t exist, it will be created automatically:

```sh
npx musket make:command SendEmails
```

### Command Structure

After generating your command, define the `signature` and `description` properties.
These are displayed when listing available commands.
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

### Exit Codes

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

### Closure Commands [WIP]

Musket will soon support closure-based commands, allowing quick command definitions without creating full class files.

### Command Signature

Commands often need input from the user — either through **arguments** or **options**.
You can define these expectations directly in the command’s `signature` property using an expressive, route-like syntax.

For example:

```ts
protected signature = 'user:create {name} {--admin}';
```

This defines a command named `user:create` that accepts a `name` argument and an optional `--admin` flag.

### Basic Examples

| Type                    | Example                                                      | Description                 |
| ----------------------- | ------------------------------------------------------------ | --------------------------- |
| **Basic Command**       | `'my:command'`                                               | Simple command name         |
| **Arguments**           | `'user:create {name}'`                                       | Required argument           |
| **Optional Arguments**  | `'user:create {name} {email?}'`                              | Optional argument           |
| **With Descriptions**   | `'user:create {name : The user name} {email? : User email}'` | Adds inline docs            |
| **Boolean Flags**       | `'user:create {name} {--admin : Make user an admin}'`        | Option without value        |
| **Options with Values** | `'backup:create {--format=zip : Backup format}'`             | Option that expects a value |
| **Shortcuts**           | `'serve:start {--p\|port=3000 : Port number}'`               | Option aliases              |

### Complex Signature Example

```ts
protected signature = `user:create
  {name : The user name}
  {email? : Optional email address}
  {--admin : Grant admin privileges}
  {--role=user : Set user role}
  {--f|force : Skip confirmation}`;
```

### Namespaced Commands

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

#### Sub Command Signature

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

When building CLI commands, you’ll often need to collect input from users in the form of **arguments** or **options**. Musket makes it simple to define these expectations directly within your command’s `signature` property. The `signature` defines the command name, its arguments, and its options in a single, expressive, route-like syntax.

### Arguments

User-supplied arguments and options are declared inside curly braces. For example, the command below defines one required argument named `user`:

```ts
protected signature = 'mail:send {user}';
```

You can make arguments optional or even assign them default values:

```ts
// Optional argument
'mail:send {user?}';

// Optional argument with default value
'mail:send {user=foo}';
```

### Options

Options are another way to receive input, typically prefixed by two hyphens (`--`) when passed through the command line. There are two types of options:

- **Switch options** – act as boolean flags.
- **Valued options** – expect a value.

Here’s an example of a boolean switch:

```ts
protected signature = 'mail:send {user} {--queue}';
```

If the `--queue` option is present, its value will be `true`; otherwise, it will be `false`:

```sh
npx musket mail:send 1 --queue
```

#### Options With Values

To define an option that expects a value, append an equals sign (`=`) to the option name:

```ts
protected signature = 'mail:send {user} {--queue=}';
```

When executing the command:

```sh
npx musket mail:send 1 --queue=default
```

If no value is passed, the option defaults to `null`.
You may also define a default value directly in the signature:

```ts
'mail:send {user} {--queue=default}';
```

#### Option Shortcuts

You can provide a shorthand version of an option by placing it before the full option name, separated by a pipe (`|`):

```ts
'mail:send {user} {--Q|queue}';
```

This allows you to call the command using the shortcut:

```sh
npx musket mail:send 1 -Qdefault
```

### Input Arrays

To accept multiple values for a single argument or option, append an asterisk (`*`) after its name.

For example, defining a multi-value argument:

```ts
'mail:send {user*}';
```

When executed:

```sh
npx musket mail:send 1 2
```

The `user` argument will contain an array: `['1', '2']`.

You can also combine the `*` with the optional marker `?` to allow zero or more values:

```ts
'mail:send {user?*}';
```

#### Option Arrays

Options can also accept multiple values using the same syntax:

```ts
'mail:send {--id=*}';
```

Now you can pass multiple `--id` flags:

```sh
npx musket mail:send --id=1 --id=2
```

### Input Descriptions

You can provide descriptions for arguments and options by separating the name from its description with a colon (`:`). You may also format long signatures across multiple lines for readability:

```ts
protected signature = `mail:send
    {user : The ID of the user}
    {--queue : Whether the job should be queued}
`;
```

## Command Input & Output

### Retrieving Input

When executing a command, you’ll often need to access the arguments and options provided by the user. Musket provides simple methods for retrieving them.

You can retrieve a single argument using the `argument` method. If the argument does not exist, `null` will be returned:

```ts
/**
 * Execute the console command.
 */
public async handle(): Promise<void> {
  const userId = this.argument('user');
}
```

To retrieve all arguments at once, use the `arguments` method:

```ts
const args = this.arguments();
```

Options can be accessed in the same way using the `option` and `options` methods:

```ts
// Retrieve a specific option
const queueName = this.option('queue');

// Retrieve all options as an object
const opts = this.options();
```

### Prompting for Input [WIP]

Musket also allows you to interactively collect user input directly from the terminal.

The `ask` method prompts the user with a question and returns their response:

```ts
public async handle(): Promise<void> {
  const name = await this.ask('What is your name?');
}
```

You may also define a default value that will be returned if the user provides no input:

```ts
const name = await this.ask('What is your name?', 'Legacy');
```

For sensitive information, the `secret` method hides user input as they type — ideal for passwords or tokens:

```ts
const password = await this.secret('Enter your password:');
```

### Asking for Confirmation [WIP]

When you need a simple “yes” or “no” confirmation, use the `confirm` method.
It returns `true` if the user responds with `y` or `yes`, otherwise `false`:

```ts
if (await this.confirm('Do you wish to continue?')) {
  // Continue execution
}
```

You can also make `true` the default response by passing it as the second argument:

```ts
if (await this.confirm('Proceed with installation?', true)) {
  // Automatically continues if no response
}
```

### Auto-Completion [WIP]

The `anticipate` method provides auto-complete suggestions as the user types.
Users can still enter any custom input even if it’s not in the suggestion list:

```ts
const name = await this.anticipate('What is your name?', ['Legacy', 'Kaylah']);
```

You can also pass a function that dynamically generates suggestions as the user types:

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

### Multiple Choice Questions [WIP]

For predefined options, use the `choice` method.
It allows you to specify the available options and an optional default index:

```ts
const name = await this.choice('What is your name?', ['Legacy', 'Kaylah'], 0);
```

You can also control how many attempts are allowed and whether users can select multiple options:

```ts
const selected = await this.choice(
  'Select your favorite languages:',
  ['JavaScript', 'TypeScript', 'Go', 'Rust'],
  0,
  3,
  true
);
```

- `ask()` returns the default or exits if none
- `confirm()` uses its default value
- `choice()` uses the default or first option
- `anticipate` returns the default or exits if none

### Writing Output

To send output to the console, you may use the `line`,`debug`, `newLine`, `info`, `success`,`comment`, `question`, `warn`, `alert`, `error` and `fail` methods. Each of these methods will use appropriate ANSI colors for their purpose. For example, let's display some general information to the user. Typically, the `info` method will display in the console as blue colored text:

```ts
/**
 * Execute the console command.
 */
public handle(): void
{
    // ...

    $this->info('The command was successful!');
}
```

To display an error message, use the error method. Error message text is typically displayed in red:

```ts
$this->error('Something went wrong!');
```

You may use the line method to display plain, uncolored text:

```ts
$this->line('Display this on the screen');
```

You may use the newLine method to display a blank line:

```ts
// Write a single blank line...
$this->newLine();

// Write three blank lines...
$this->newLine(3);
```

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

```bash
npx musket my:command
npx musket user:create "John Doe"
npx musket user:create "Jane" --admin --role=moderator
npx musket serve:start --p=8080
npx musket help user:create
```

### Global Options

#### Verbosity

```bash
npx musket my:command --quiet
npx musket my:command --silent
npx musket my:command --verbose 3
```

#### Non-Interactive

```bash
npx musket my:command --no-interaction
```

#### Combined Examples

```bash
npx musket migrate:run --quiet --no-interaction
npx musket cache:clear --silent
npx musket my:command --verbose 3
```

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
