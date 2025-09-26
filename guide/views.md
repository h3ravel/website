# Views

It’s usually not ideal to return full HTML document strings directly from your routes or controllers. That’s where views come in, they let you keep your HTML in dedicated files for better organization.

H3ravel provides built-in support for server-side rendering of HTML views using [Edge.js](https://edgejs.dev/docs/introduction), a modern template engine similar to Edge. This allows you to render dynamic pages while still benefiting from the framework’s routing and service container features.

Views help separate your application’s logic from its presentation layer and are stored in the `src/resources/views` directory. In Laravel, these templates are typically written using the Edge templating engine. Here’s an example of a basic view:

View stored in `src/resources/views/greeting.edge`

```html
<html>
  <body>
    <h1>Hello, {{ $name }}</h1>
  </body>
</html>
```

Since this view is stored at `src/resources/views/greeting.edge`, we may return it using the view binding like so:

```ts
Route.get('/', function ({ app }) {
  const view = app.make('view');

  return view('greeting', { name: 'Legacy' });
});
```

::: info
Want to dive deeper into writing Edge templates? Check out the full [Edge.js documentation](https://edgejs.dev/docs/introduction) to get started.
:::

## Creating and Rendering Views

To create a view, simply add a file with the `.edge` extension to your application’s `src/resources/views` directory, or generate one using the `make:view` Musket command.

```sh
$ npx musket make:view greeting
```

The `.edge` extension tells the framework that the file contains an Edge template, which can include plain HTML along with Edge directives for rendering values, handling conditionals, looping through data, and more.

After creating a view, you can return it from any of your application’s routes or controllers using the `view` binding:

```ts
Route.get('/', function ({ app }) {
  const view = app.make('view');

  return view('greeting', { name: 'Legacy' });
});
```

## Sharing Data with Views

As demonstrated in earlier examples, you can pass data to views by providing an object, making the data accessible within the view:

```ts
return view('greetings', { name: 'Victoria' });
```

Once the data is passed to the view, you can access each value using its corresponding key, for example, {{ name }} within the view.

## Predefined Global Variables in Views

You can access the following globals inside your views:

- `asset`: Asset helper
- `config`: Application config values
- `app`: The application instance

Example

```html
<img src="{{ asset('images/logo.png') }}" alt="Logo" />
<p>App Name: {{ config('app.name') }}</p>
```
