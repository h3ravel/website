---
outline: [2, 4]
---

# Database Migration

Migration is database version control, which helps developers complete table structure changes and data migration in daily work.

## Quick start

### Generate migration

First, generate a configuration file.

```bash
$ npx arquebus init
```

If you want to install Arquebus ORM's command line tool globally, you can use the following command:

```bash
$ npm install -g @h3ravel/arquebus
$ arquebus init
```

This will generate a `arquebus.config.js` file in the project directory, which is used to set database connection and other information.

```ts
// Update with your config settings.

export default {
  client: 'mysql2',
  connection: {
    host: 'localhost',
    database: 'database',
    user: 'root',
    password: 'password',
  },
  // You can add multiple connections, just specify the connection name.
  connections: {
    pgsql: {
      client: 'pg',
      connection: {
        host: 'localhost',
        database: 'another_database',
        user: 'root',
        password: 'password',
      },
    },
  },
  migrations: {
    table: 'migrations',
    path: 'migrations',
  },
  models: {
    path: 'models',
  },
};
```

You can then use the `migrate:make` command to generate database migrations. New migration files are placed in your `migrations` directory by default. Each migration file name contains a timestamp to allow Arquebus ORM to determine the order of migrations:

```bash
$ npx arquebus migrate:make create_flights_table
```

Arquebus ORM will use the name of the migration file to guess the table name and whether the migration will create a new table. If Arquebus ORM is able to determine the name of the table from the name of the migration file, it will prepopulate the specified table in the generated migration file, or you can manually specify the table name directly in the migration file.

If you want to specify a custom path for the generated migrations, you can use the `--path` option when executing the `migrate:make` command. The given path should be relative to the path where the command is executed.

### Migration structure

The migration class contains two methods: `up` and `down`. The `up` method is used to add a new table, column or index to the database, while the `down` method is used to undo the operation performed by the `up` method. .

In both methods, you can use Schema builders to expressively create and modify tables. To learn about all the methods available on the Schema builder, check out its documentation. For example, the following migration creates a `flights` table:

```ts
import { Migration } from '@h3ravel/arquebus';

export default class extends Migration {
  /**
   * Run the migrations.
   */
  async up(schema) {
    await schema.createTable('flights', (table) => {
      table.increments('id');
      table.string('name');
      table.string('airline');
      table.timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  async down(schema) {
    await schema.dropTableIfExists('flights');
  }
}
```

### Migration Connection

If your migration interacts with a database connection other than the default database connection of the application, you should set the `connection` property of the migration to specify the database connection to use.

```ts
export default class extends Migration {
  connection = 'pgsql';

  /**
   * Run the migrations.
   */
  async up(schema) {
    // ...
  }
}
```

### Execute migration

Execute the `migrate:run` command to run all unexecuted migrations:

::: code-group

```bash [arquebus]
$ npx arquebus migrate:run
```

```bash [musket]
$ npx musket migrate:run
```

:::

If you want to see which migrations have been performed so far, you can use the `migrate:status` command:

::: code-group

```bash [arquebus]
$ npx arquebus migrate:status
```

```bash [musket]
$ npx musket migrate:status
```

:::

### Rollback migration

If you want to roll back the last migration operation, you can use `migrate:rollback`. This command will roll back the last "batch" of migrations, which may include multiple migration files:

::: code-group

```bash [arquebus]
$ npx arquebus migrate:rollback
```

```bash [musket]
$ npx musket migrate:rollback
```

:::

You can roll back a specified number of migrations by adding the `step` parameter to the `rollback` command. For example, the following command will roll back the last five migrations:

::: code-group

```bash [arquebus]
$ npx arquebus migrate:rollback --step=5
```

```bash [musket]
$ npx musket migrate:rollback --step=5
```

:::

The `migrate:reset` command will roll back all of your application's migrations:

::: code-group

```bash [arquebus]
$ npx arquebus migrate:reset
```

```bash [musket]
$ npx musket migrate:reset
```

:::

Roll Back and Migrate Using a Single Command
The `migrate:refresh` command will roll back all of your migrations and then execute the migrate command. This command effectively re-creates your entire database:

::: code-group

```bash [arquebus]
$ npx arquebus migrate:refresh
```

```bash [musket]
$ npx musket migrate:refresh
```

:::

You may roll back and re-migrate a limited number of migrations by providing the step option to the refresh command. For example, the following command will roll back and re-migrate the last five migrations:

::: code-group

```bash [arquebus]
$ npx arquebus migrate:refresh --step=5
```

```bash [musket]
$ npx musket migrate:refresh --step=5
```

:::

#### Drop All Tables and Migrate

The `migrate:fresh` command will drop all tables from the database and then execute the migrate command:

::: code-group

```bash [arquebus]
$ npx arquebus migrate:fresh
```

```bash [musket]
$ npx musket migrate:fresh
```

:::

> The `migrate:fresh` command will drop all database tables regardless of their prefix. This command should be used with caution when developing on a database that is shared with other applications.

## Tables

### Create tables

Next we will create a new data table using the `createTable` method. `createTable` accepts two parameters: the first parameter is the table name, and the second parameter is a callback function:

```ts
import { Migration } from '@h3ravel/arquebus';

export default class extends Migration {
  /**
   * Run the migrations.
   */
  async up(schema) {
    await schema.createTable('users', (table) => {
      table.increments('id');
      table.string('name');
      table.string('email');
      table.timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  async down(schema) {
    await schema.dropTableIfExists('users');
  }
}
```

When you create a table, you can use the Database Structure Builder's columns method to define the table's columns.

#### Check if table/column exists

You can check whether a table or column exists using the `hasTable` and `hasColumn` methods:

```ts
if (await schema.hasTable('users')) {
  // "users" table exists...
}

if (await schema.hasColumn('users', 'email')) {
  // The "users" table exists and has the "email" column...
}
```

Additionally, a number of other properties and methods are available to define other places where the table is created. When using MySQL, you can use the engine method to specify the storage engine of the table:

```ts
await schema.createTable('users', (table) => {
  table.engine('InnoDB');

  // ...
});
```

The `charset` and `collate` methods can be used to specify the character set and collation for tables created when using MySQL:

```ts
await schema.createTable('users', (table) => {
  table.charset('utf8mb4');
  table.collate('utf8mb4_unicode_ci');

  // ...
});
```

If you want to add a "comment" to a database table, you can call the `comment` method on the table instance. Currently only MySQL and Postgres support table comments:

```ts
await schema.createTable('calculations', (table) => {
  table.comment('Business calculations');

  // ...
});
```

### Update tables

Schema's `table` method can be used to update an existing table. Like the `createTable` method, the `table` method accepts two parameters: the name of the table and a callback function that can be used to add columns or indexes to the table:

```ts
await schema.table('users', (table) => {
  table.integer('votes');
});
```

### Rename/delete tables

To rename an existing table, use the `renameTable` method:

```ts
await schema.renameTable(from, to);
```

To drop an existing table, you can use the `dropTable` or `dropTableIfExists` method:

```ts
await schema.dropTable('users');

await schema.dropTableIfExists('users');
```

## Columns

### Create Columns

Schema's `table` method can be used to update a table. Like the `createTable` method, the `table` method accepts two parameters: the table name and a callback function that can be used to add columns to the table:

```ts
await schema.table('users', (table) => {
  table.integer('votes');
});
```

### Available column types

Schema builders provide a variety of methods for creating columns of corresponding types in tables. All available methods are listed below:

#### bigIncrements

The `bigIncrements` method is used to create an auto-incrementing `UNSIGNED BIGINT` type (primary key) column in the data table:

```ts
table.bigIncrements('id');
```

#### bigInteger

The `bigInteger` method is used to create a `BIGINT` type column in the data table:

```ts
table.bigInteger('votes');
```

#### binary

The `binary` method is used to create a `BLOB` type column in the data table:

```ts
table.binary('photo');
```

#### boolean

The `boolean` method is used to create a `BOOLEAN` type column in the data table:

```ts
table.boolean('confirmed');
```

#### datetime

The `datetime` method is used to create a `DATETIME` type column in the data table. The optional parameter is the total number of digits of precision:

```ts
table.datetime('created_at', { precision: 6 });
```

#### date

The `date` method is used to create a `DATE` type column in the data table:

```ts
table.date('date');
```

#### decimal

The `decimal` method is used to create a `DECIMAL` type column in the data table. The optional parameters are the total number of valid words and the total number of decimal places:

```ts
table.decimal('amount');
table.decimal('amount', 8, 2);
```

#### double

The `double` method is used to create a `DOUBLE` type column in the data table. The optional parameters are the total number of valid words and the total number of decimal places:

```ts
table.double('amount', 8, 2);
```

#### enum

The `enum` method is used to create a column of type `ENUM` in the data table:

```ts
table.enum('difficulty', ['easy', 'hard']);
```

#### float

The `float` method is used to create a `FLOAT` type column in the data table. The optional parameters are the total number of valid words and the total number of decimal places:

```ts
table.float('amount', 8, 2);
```

#### geometry

The `geometry` method is equivalent to `GEOMETRY`:

```ts
table.geometry('positions');
```

#### increments

The `increments` method creates an auto-incrementing column equivalent to `UNSIGNED INTEGER` as the primary key:

```ts
table.increments('id');
```

#### integer

The `integer` method is used to create a column of type `INTEGER` in the data table:

```ts
table.integer('votes');
```

#### json

The `json` method is used to create a `JSON` type column in the data table:

```ts
table.json('options');
```

#### jsonb

The `jsonb` method is used to create a `JSONB` type column in the data table:

```ts
table.jsonb('options');
```

#### point

The `point` method is used to create a `POINT` type column in the data table:

```ts
table.point('position');
```

#### smallint

The `smallint` method is used to create a `SMALLINT` type column in the data table:

```ts
table.smallint('votes');
```

#### string

The `string` method creates a `VARCHAR` equivalent column of a given length, equivalent to a VARCHAR of the specified length:

```ts
table.string('name', 100);
```

#### text

The `text` method is used to create a `TEXT` type column in the data table:

```ts
table.text('description');
```

#### time

The `time` method creates a `TIME` equivalent column with optional precision (total number of digits):

```ts
table.time('sunrise', { precision: 6 });
```

#### timestamp

The `timestamp` method creates a column of type `TIMESTAMP` with an optional precision (total number of digits):

```ts
table.timestamp('sunrise', { precision: 6 });
```

#### timestamps

The `timestamps` method creates `created_at` and `updated_at` `TIMESTAMP` equivalent columns:

```ts
table.timestamps();
```

#### tinyint

The `tinyint` method is used to create a `TINYINT` type column in the data table:

```ts
table.tinyint('votes');
```

#### uuid

The `uuid` method is used to create a `UUID` type column in the data table:

```ts
table.uuid('id');
```

### Columns modifiers

In addition to the column types listed above, there are several "modifiers" that can be used when adding columns to a database table. For example, if you want to set a column to be "nullable", you can use the `nullable` method:

```ts
await schema.table('users', (table) => {
  table.string('email').nullable();
});
```

The following table shows all available column modifiers. This list does not include index modifiers:

| Modifier                      | Description                                                         |
| ----------------------------- | ------------------------------------------------------------------- |
| `.after('column')`            | Place the column "after" other columns (MySQL)                      |
| `.charset('utf8mb4')`         | Specify the character set for this column (MySQL)                   |
| `.collate('utf8_unicode_ci')` | Specify the collation for this column (MySQL/PostgreSQL/SQL Server) |
| `.comment('my comment')`      | Add a comment to the column (MySQL/PostgreSQL)                      |
| `.defaultTo(value)`           | Specify a "default value" for the column                            |
| `.first()`                    | Place the column "first" in the table (MySQL)                       |
| `.nullable()`                 | Allows NULL values to be inserted into this column                  |
| `.unsigned()`                 | Set a column of type INTEGER to UNSIGNED (MySQL)                    |

### Modify columns

The `alter` method can modify an existing column type to a new type or modify attributes. For example, you might want to increase the length of the `string` column by using the `alter` method to increase the length of the `name` column from 25 to 50. So, we can simply update the column properties and call the `alter` method:

```ts
await schema.table('users', (table) => {
  table.string('name', 50).alter();
});
```

When modifying a column, you must explicitly include all modifiers that you want to retain on the column definition - any missing attributes will be discarded. For example, in order to preserve the unsigned, default, and comment attributes, you must explicitly modify each attribute when modifying the column.

```ts
await schema.table('users', (table) => {
  table.integer('votes').unsigned().defaultTo(1).comment('my comment').alter();
});
```

#### Rename columns

To rename a column, you can use the `renameColumn` method provided by the schema builder:

```ts
await schema.table('users', (table) => {
  table.renameColumn('from', 'to');
});
```

### Delete columns

To drop a column, you can use the `dropColumn` method.

```ts
await schema.table('users', (table) => {
  table.dropColumn('votes');
});
```

If you want to delete multiple columns, you can use the `dropColumns` method.

```ts
await schema.table('users', (table) => {
  table.dropColumns('votes', 'avatar', 'location');
});
```

## Indexes

### Create indexes

The structure builder supports several types of indexes. The following example creates a new `email` column with a unique value. We can chain the `unique` method to the column definition to create an index:

```ts
await schema.table('users', (table) => {
  table.string('email').unique();
});
```

Alternatively, you can create the index after defining the columns. To do this, you should call the `unique` method on the structure builder, which should be passed the column name of the unique index:

```ts
table.unique('email');
```

You can even pass an array to the index method to create a compound (or synthetic) index:

```ts
table.index(['account_id', 'created_at']);
```

When creating an index, Arquebus ORM will automatically generate a reasonable index name, but you can also pass parameters to customize the index name:

```ts
table.index(['name', 'last_name'], 'idx_name_last_name');
table.unique('email', {
  indexName: 'unique_email',
});
```

#### Available index types

Below are all available indexing methods:

| Command                               | Description               |
| ------------------------------------- | ------------------------- |
| `table.primary('id');`                | Add primary key           |
| `table.primary(['id', 'parent_id']);` | Add composite primary key |
| `table.unique('email');`              | Add unique index          |
| `table.index('state');`               | Add a normal index        |

### Delete indexes

To delete an index, pass the column array to the `dropIndex` method, which will delete the index name generated based on the table name, column and key type. You can also specify the index name as the second parameter:

| Command                                            | Description                                    |
| -------------------------------------------------- | ---------------------------------------------- |
| `table.dropPrimary('users', 'users_id_primary');`  | Delete the primary key from the "users" table  |
| `table.dropUnique('users', 'users_email_unique');` | Delete the unique index from the "users" table |
| `table.dropIndex('geo', 'geo_state_index');`       | Drop the base index from the "geo" table       |

### Foreign key constraints

Arquebus ORM also supports the creation of foreign key constraints for enforcing referential integrity in the database layer. For example, let's define a `user_id` column on the `posts` table that references the `id` column of the `users` table:

```ts
await schema.createTable('posts', (table) => {
  table.integer('user_id').unsigned().notNullable();
  table.string('title', 30);
  table.string('content');

  table.foreign('user_id').references('id').inTable('users');
});
```
