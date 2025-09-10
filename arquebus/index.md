# Arquebus ORM: Getting Started

## Introduction

Arquebus ORM is a Beautiful, expressive framework-agnostic Object-Relational Mapper (ORM) inspired by Laravel's Eloquent, designed for TypeScript applications and for the H3ravel Framework that makes it enjoyable to interact with your database. When using Arquebus, each database table has a corresponding "Model" that is used to interact with that table. In addition to retrieving records from the database table, Arquebus models allow you to insert, update, and delete records from the database as well.

> Arquebus is a Typescript and Modern JS rewrite of [Sutando](https://sutando.org/) and is heavily inspired by Laravel's ORM [Eloquent](https://laravel.com/docs/12.x/eloquent).

The name "Arquebus" is derived from the form of long gun that appeared in Europe and the Ottoman Empire during the 15th century, and since H3ravel is the web framework that masks your fears, we hope that Arquebus ORM provides powerful features and flexibility to your application, enough to mask every fear you've previouly had fo building database experiences.

## Features

- Framework-Agnostic – Arquebus ORM can be used on frameworks other than H3ravel.
- Support Or Multiple Database – MySQL, PostgreSQL, SQLite, MariaDB and others.
- Query Builder – A convenient, fluent interface to creating and running database queries.
- Transactions – Easy To Use Transactions
- Relationships – Model relationships for handling complex data queries and operations.
- Migrations – Allowing your team to define and share your application's database schema definition.
- Hooks – Support for hooks to execute custom logic at different event lifecycles.

## Quick Start

### Install

Install Arquebus ORM and mysql database library (if you use H3ravel, Arquebus ORM comes pre-installed)

::: code-group

```sh [npm]
$ npm install @h3ravel/arquebus mysql2 --save
```

```sh [yarn]
$ yarn add @h3ravel/arquebus mysql2
```

```sh [pnpm]
$ pnpm add @h3ravel/arquebus mysql2
```

:::

## Initialize

After installation run the following command to initialize arquebus:

::: code-group

```sh [npm]
$ npm run arquebus init
```

```sh [yarn]
$ yarn arquebus init
```

```sh [pnpm]
$ pnpm arquebus init
```

This will create the `arquebus.config.[js|ts]` file at the root directory of your project.

You can pass the `--type ts` flag to generate a typscript config instead.

:::

### Connect

If you use Arquebus ORM within H3ravel, use the [Database Connection Manager](/guide/database/connections) to setup your database connection.

```ts
import { arquebus } from '@h3ravel/arquebus';

// Add SQL Connection Info
arquebus.addConnection({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'test',
  },
});
```

### Query

The easiest way to make SQL queries is to use the Database query builder. It allows you to construct simple and complex SQL queries using JavaScript methods.

In the following example, we select all the posts from the users table.

```ts
import { arquebus, Model } from '@h3ravel/arquebus';

const db = arquebus.fire();

// Using The Query Builder
const users = await arquebus.table('users').where('votes', '>', 100).get();
// or
const users = await db.table('users').where('votes', '>', 100).get();

// Using The Schema Builder
await arquebus.schema().createTable('users', (table) => {
  table.increments('id').primary();
  table.integer('votes');
  table.timestamps();
});

// Using The ORM
class User extends Model {}
const users = await User.query().where('votes', '>', 100).get();
```

### Autoloading the configuration file

Because the configuration files requires asynchronous loading, we do not auto load it by default, if you want skip using the `arquebus.addConnection` and allow the system to autommatically create a connection using the generated configuraiton file instead, you can call the asynchronous `arquebus.addConnection` method before calling `arquebus.fire`

```ts
import { arquebus, Model } from '@h3ravel/arquebus';

const init = async () => {
  const config = await arquebus.autoLoad();

  return arquebus.fire(config.client);
};

const db = await init();

// Now you can use the query builder and other methods
const users = await arquebus.table('users').where('votes', '>', 100).get();
// or
const users = await db.table('users').where('votes', '>', 100).get();
```
