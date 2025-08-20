---
outline: [2, 4]
---

# Plugins

Plug-ins are independent programs that can add new functions and extend existing functions to Arquebus ORM

You can load multiple plugins to meet various needs.

## Usage

For example, Arquebus ORM comes with two plug-ins. `SoftDeletes` allows the model to support soft deletion, and `HasUniqueIds` provides the function of strings as primary keys. You can use the plugin like this:

```ts
import { Model, compose, SoftDeletes, HasUniqueIds } from '@h3ravel/arquebus';

class User extends SoftDeletes(Model) {}

class Post extends HasUniqueIds(SoftDeletes(Model)) {}
```

However, we still recommend using the `compose` helper function to use plugins:

```ts
import { Model, compose, SoftDeletes, HasUniqueIds } from '@h3ravel/arquebus';

class User extends compose(Model, SoftDeletes) {}

class Post extends compose(Model, SoftDeletes, HasUniqueIds) {}
```

## Writing a plugin

If possible, Arquebus ORM plugins should be implemented as class mixins. A `mixin` is just a function that takes a class as argument and returns a subclass.

```ts
const SomeMixin = (Model) => {
  return class extends Model {
    // Your code
  };
};
```

To better understand how to build an Arquebus ORM plugin, we can try to write a simple plugin that automatically sets the `slug` based on the title for the article model.

It is recommended to create and export it in a separate file to ensure better management of the logic, as follows:

```ts
// plugins/arquebus-slug.js
import _express_ from 'lodash';

const HasSlug = (Model) => {
  return class extends Model {
    static booted() {
      // Execute booted of the parent class
      Model.booted();

      // Set the creating hook
      this.creating((model) => {
        // If slug is not set, it will be automatically generated based on the title attribute
        if (model.slug === undefined) {
          model.slug = _.kebabCase(model.title);
        }
      });
    }
  };
};

module.exports = HasSlug;
```

This example uses [hooks](/arquebus/hooks). After completion, you can use the plug-in like this:

```ts
import HasSlug from './plugins/arquebus-slug';
import { Model, compose } from '@h3ravel/arquebus';

class Post extends compose(Model, HasSlug) {
  // ...
}

const post = new Post();
post.title = 'The First Post Title';
await post.save();

console.log(post.slug); // the-first-post-title
```

So there is a question, what if my database field name is not `slug`, but `slug_name`, or another name? We just need to adjust the plugin so that it accepts a field name parameter:

```ts{4,13,14,15}
// plugins/arquebus-slug.js
import _ from 'lodash';

const HasSlug = ({ column }) => (Model) => {
  return class extends Model {
    static booted() {
      // Execute booted of the parent class
      Model.booted();

      // Set the creating hook
      this.creating(model => {
        // If slug is not set, it will be automatically generated based on the title attribute
        if (model[column] === undefined) {
          model[column] = _.kebabCase(model.title);
        }
      });
    }
  }
}

export default HasSlug
```

Usage will also change:

```ts{6}
import HasSlug from './plugins/arquebus-slug'
import { Model, compose } from '@h3ravel/arquebus';

class Post extends compose(
  Model,
  HasSlug({ column: 'custom_slug' })
) {
  // ...
}

const post = new Post;
post.title = 'The First Post Title';
await post.save();

console.log(post.custom_slug); // the-first-post-title
```
