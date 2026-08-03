# Command Lifecycle Events

Musket exposes events that allow applications and packages to listen to the command execution lifecycle.

The available events are:

- `beforeHandle`
- `afterHandle`
- `handleFailed`

## Before Handle

The `beforeHandle` event is emitted immediately before the command's `handle()` method or custom resolver is called:

```ts
protected registerMusketListeners(
  musket: Musket<this>,
): void {
  musket.beforeHandle.on(({ app, command }) => {
    console.log(
      `Handling ${command.constructor.name}`,
    );

    console.log(app);
  });
}
```

The listener receives:

```ts
{
  app,
  command,
}
```

Listeners may also be asynchronous:

```ts
musket.beforeHandle.on(async ({ command }) => {
  await prepareCommand(command);
});
```

## After Handle

The `afterHandle` event is emitted after a command has completed successfully:

```ts
protected registerMusketListeners(
  musket: Musket<this>,
): void {
  musket.afterHandle.on(({
    command,
    result,
  }) => {
    console.log(
      `Handled ${command.constructor.name}`,
      result,
    );
  });
}
```

The listener receives:

```ts
{
  app,
  command,
  result,
}
```

The `result` property contains the value returned by the command's `handle()` method or custom resolver.

## Handle Failed

The `handleFailed` event is emitted when the command's `handle()` method or custom resolver throws an error:

```ts
protected registerMusketListeners(
  musket: Musket<this>,
): void {
  musket.handleFailed.on(({
    command,
    error,
  }) => {
    console.error(
      `Failed to handle ${command.constructor.name}`,
      error,
    );
  });
}
```

The listener receives:

```ts
{
  app,
  command,
  error,
}
```

The original error is rethrown after all failure listeners have completed.

The command lifecycle follows this order:

```text
beforeHandle
    ├── success → afterHandle
    └── failure → handleFailed → rethrow
```

Errors thrown by a `beforeHandle` listener are not considered command handling failures and therefore do not emit `handleFailed`.

## Removing Listeners

The `on()` method returns a function that can be used to remove the listener:

```ts
const removeListener = musket.beforeHandle.on(({ command }) => {
  console.log(command.constructor.name);
});

removeListener();
```

Listeners may also be registered to run only once:

```ts
musket.beforeHandle.once(({ command }) => {
  console.log(`First command: ${command.constructor.name}`);
});
```

## Event Listener Shortcut

Musket provides a `listen()` method as a convenient alternative to accessing its lifecycle event properties directly.

```ts
musket.listen('handling', ({ command }) => {
  console.log(`Handling ${command.constructor.name}`);
});

musket.listen('handled', ({ command, result }) => {
  console.log(`${command.constructor.name} completed`, result);
});

musket.listen('error', ({ command, error }) => {
  console.error(`${command.constructor.name} failed`, error);
});
```

The supported event names are:

| Event      | Lifecycle event | Emitted when                             |
| ---------- | --------------- | ---------------------------------------- |
| `handling` | `beforeHandle`  | Before command handling begins           |
| `handled`  | `afterHandle`   | After the command completes successfully |
| `error`    | `handleFailed`  | When command handling throws an error    |

The following registrations are equivalent:

```ts
musket.listen('handling', callback);
musket.beforeHandle.on(callback);
```

```ts
musket.listen('handled', callback);
musket.afterHandle.on(callback);
```

```ts
musket.listen('error', callback);
musket.handleFailed.on(callback);
```

The method returns a function that removes the listener:

```ts
const removeListener = musket.listen('handled', ({ command }) => {
  console.log(command.constructor.name);
});

removeListener();
```

## Listening from Commands

The base `Command` class also exposes a `listen()` method. It delegates listener registration to the current Musket instance:

```ts
export default class GreetCommand extends Command {
  protected signature = 'greet {name}';

  async handle(): Promise<void> {
    const removeListener = this.listen('error', ({ command, error }) => {
      console.error(`${command.constructor.name} failed`, error);
    });

    this.info(`Hello, ${this.argument('name')}!`);

    removeListener();
  }
}
```

The command shortcut supports the same event names and payloads as `Musket.listen()`:

```ts
this.listen('handling', ({ app, command }) => {
  //
});

this.listen('handled', ({ app, command, result }) => {
  //
});

this.listen('error', ({ app, command, error }) => {
  //
});
```

When Musket has not yet been attached to the application, `Command.listen()` does not register the listener and returns an empty removal function.

Listeners registered during `handle()` remain active until removed. A `handling` listener registered from inside `handle()` will not receive the current command's event because that event has already been emitted.
