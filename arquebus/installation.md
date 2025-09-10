---
outline: deep
---

# Installation

Arquebus ORM comes pre-installed with [H3ravel Framework](/), enabling developers to dive into building applications immediately after installation. This guide exists to provide clear insight into set up and effective utilization of the Arquebus ORM in other environments for non-H3ravel users.

The primary target environment for Arquebus ORM is Node.js, you will need to install the arquebus library, and then install the appropriate database library: `pg` for PostgreSQL, CockroachDB and Amazon Redshift, `pg-native` for PostgreSQL with native C++ `libpq` bindings (requires PostgresSQL installed to link against), `mysql` for MySQL or MariaDB, `sqlite3` for SQLite3, or `tedious` for MSSQL.

## Installing

Arquebus ORM is available via npm (or yarn/pnpm).

::: code-group

```sh [npm]
$ npm install @h3ravel/arquebus --save
```

```sh [yarn]
$ yarn add @h3ravel/arquebus
```

```sh [pnpm]
$ pnpm add @h3ravel/arquebus
```

```sh [bun]
$ bun create @h3ravel/arquebus
```

:::

You also need to install one of the following depending on the database you want to use:

::: code-group

```sh [npm]
$ npm install pg --save
$ npm install sqlite3 --save
$ npm install better-sqlite3 --save
$ npm install mysql --save
$ npm install mysql2 --save
$ npm install tedious --save
```

```sh [yarn]
$ yarn add pg
$ yarn add sqlite3
$ yarn add better-sqlite3
$ yarn add mysql
$ yarn add mysql2
$ yarn add tedious
```

```sh [pnpm]
$ pnpm add pg
$ pnpm add sqlite3
$ pnpm add better-sqlite3
$ pnpm add mysql
$ pnpm add mysql2
$ pnpm add tedious
```

```sh [bun]
$ bun create pg
$ bun create sqlite3
$ bun create better-sqlite3
$ bun create mysql
$ bun create mysql2
$ bun create tedious
```

:::

## Configuration

To connect to the database, you must add a connection. The client parameter is required and determines which client adapter will be used with the library.

### MySQL

```ts
import { arquebus } from '@h3ravel/arquebus';

arquebus.addConnection({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'myapp_test',
  },
});

// And you can add multiple connections, just specify the connection name.
arquebus.addConnection(
  {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'another_database_user',
      password: 'another_database_password',
      database: 'myapp_another',
    },
  },
  'another_mysql'
);

const db = arquebus.fire('another_mysql');
```

The connection options are passed directly to the appropriate database client to create the connection, and may be either an object, a connection string, or a function returning an object:

### SQLite3 or Better-SQLite3

When you use the SQLite3 or Better-SQLite3 adapter, there is a filename required, not a network connection. For example:

```ts
arquebus.addConnection({
  client: 'sqlite3', // or 'better-sqlite3'
  connection: {
    filename: './mydb.sqlite',
  },
});
```

You can also run either SQLite3 or Better-SQLite3 with an in-memory database by providing `:memory:` as the filename. For example:

```ts
arquebus.addConnection({
  client: 'sqlite3', // or 'better-sqlite3'
  connection: {
    filename: ':memory:',
  },
});
```

When you use the SQLite3 adapter, you can set flags used to open the connection. For example:

```ts
arquebus.addConnection({
  client: 'sqlite3',
  connection: {
    filename: 'file:memDb1?mode=memory&cache=shared',
    flags: ['OPEN_URI', 'OPEN_SHAREDCACHE'],
  },
});
```

### PostgreSQL

The database version can be added in arquebus configuration, when you use the PostgreSQL adapter to connect a non-standard database.

```ts
arquebus.addConnection({
  client: 'pg',
  version: '7.2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'myapp_test',
  },
});
```
