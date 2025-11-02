# Helpers

## Introduction

H3ravel includes a number of global framework agnostic "helper" TS functions. Many of these functions are used by the framework itself; however, you are free to use them in your own applications if you find them convenient.

## Installation

To use these helpers in your application, you may install the `@h3ravel/support` package by running:

::: code-group

```sh [npm]
$ npm install @h3ravel/support --save
```

```sh [yarn]
$ yarn add @h3ravel/support
```

```sh [pnpm]
$ pnpm add @h3ravel/support
```

```sh [bun]
$ bun create @h3ravel/support
```

:::

The `@h3ravel/support` is installed by default when using H3ravel

## Available Methods

### Array Helpers

The `Arr` class from `@h3ravel/support` provides a rich set of framework-agnostic utilities for working with JavaScript arrays and objects.
Many of these methods mirror Laravel’s `Illuminate\Support\Arr`, offering familiar behavior with a TypeScript-friendly API.

| [Accessors](#accessors)         | [Transformers](#transformers)     | [Utilities](#utilities)             |
| ------------------------------- | --------------------------------- | ----------------------------------- |
| [`dot`](#arr-dot)               | [`array`](#arr-array)             | [`boolean`](#arr-boolean)           |
| [`map`](#arr-map)               | [`chunk`](#arr-chunk)             | [`collapse`](#arr-collapse)         |
| [`except`](#arr-except)         | [`sortDesc`](#arr-sortdesc)       | [`isEmpty`](#arr-isempty)           |
| [`isNotEmpty`](#arr-isnotempty) | [`range`](#arr-range)             | [`reverse`](#arr-reverse)           |
| [`wrap`](#arr-integer)          | [`float`](#arr-float)             | [`float`](#arr-from)                |
| [`combine`](#arr-combine)       | [`has`](#arr-has)                 | [`only`](#arr-only)                 |
| [`crossJoin`](#arr-crossjoin)   | [`first`](#arr-first)             | [`prepend`](#arr-prepend)           |
| [`divide`](#arr-divide)         | [`flatten`](#arr-flatten)         | [`pull`](#arr-pull)                 |
| [`random`](#arr-random)         | [`last`](#arr-last)               | [`shuffle`](#arr-shuffle)           |
| [`hasAny`](#arr-hasany)         | [`sort`](#arr-sort)               | [`hasAll`](#arr-hasall)             |
| [`pluck`](#arr-pluck)           | [`forget`](#arr-forget)           | [`unique`](#arr-unique)             |
| [`join`](#arr-join)             | [`where`](#arr-where)             | [`whereNotNull`](#arr-wherenotnull) |
| [`wrap`](#arr-wrap)             | [`mapWithKeys`](#arr-mapwithkeys) | [`push`](#arr-push)                 |
| [`keyBy`](#arr-keyby)           | [`string`](#arr-string)           | [`take`](#arr-take)                 |

#### `Arr.array`

The `Arr.array` method retrieves a value using dot notation, throws if value is not an array

```ts
const data = { user: { emails: ['dj@example.com', 'xr@example.com'] } };

Arr.array(data, 'user.emails');
// ['dj@example.com', 'xr@example.com']
```

#### `Arr.boolean`

The `Arr.boolean` method retrieves a value using dot notation, throws if value is not a boolean

```ts
const data = { user: { name: 'join', verified: true } };

Arr.boolean(data, 'user.verified');
// true
```

#### `Arr.has`

The `Arr.has` method determines whether a given key exists within an array or object using “dot” notation.

```ts
Arr.has({ user: { profile: { name: 'Legacy' } } }, 'user.profile.name');
// true
```

#### `Arr.first`

The `Arr.first` method returns the first element in an array that passes a given truth test. If no callback is provided, the first element in the array is returned.

```ts
Arr.first([1, 2, 3, 4], (n) => n > 2);
// 3

Arr.first([], null, 'none');
// 'none'
```

#### `Arr.float`

The `Arr.float` method retrieves a value from an array/object using dot notation, throws if value is not a float

```ts
const data = { user: { name: 'join', balance: 1.5 } };

Arr.float(data, 'user.balance');
// 1.5
```

#### `Arr.from`

The `Arr.from` method converts various input types into a plain array
Supports `Arrays`, `Objects`, `Iterables`, `Map`, `WeakMap`, and custom toArray/toJSON/jsonSerialize methods

```ts
const data = { name: 'John', plan: 'Delux' };

Arr.from(data);
// 1[ 'John', 'Delux' ]
```

#### `Arr.last`

The `Arr.last` method returns the last element in an array that passes a given truth test. If no callback is provided, the last element is returned.

```ts
Arr.last([1, 2, 3, 4], (n) => n < 3);
// 2
```

#### `Arr.pluck`

The `Arr.pluck` method retrieves all of the values for a given key from an array of objects.

```ts
const users = [
  { name: 'Legacy', email: 'legacy@example.com' },
  { name: 'Adajie', email: 'adajie@example.com' },
];

Arr.pluck(users, 'email');
// ['legacy@example.com', 'adajie@example.com']
```

#### `Arr.only`

The `Arr.only` method returns a new object containing only the specified keys from the original array or object.

```ts
Arr.only({ name: 'Legacy', age: 25, role: 'Dev' }, ['name', 'role']);
// { name: 'Legacy', role: 'Dev' }
```

#### `Arr.except`

The `Arr.except` method removes the specified keys from the given object or array.

```ts
Arr.except({ name: 'Legacy', age: 25, role: 'Dev' }, ['role']);
// { name: 'Legacy', age: 25 }
```

#### `Arr.isEmpty`

The `Arr.isEmpty` method determines if the given array has no elements or properties.

```ts
Arr.isEmpty([]);
// true
```

#### `Arr.isEmpty`

The `Arr.isNotEmpty` method determines if the given array has at least one element or property (not empty).

```ts
Arr.isNotEmpty([1, 2, 3]);
// true
```

#### `Arr.hasAll`

The `Arr.hasAll` Checks if an array or object has all the specified keys.

```ts
Arr.hasAll({ name: 'Legacy', age: 25 }, ['email', 'name']);
// false
```

#### `Arr.hasAny`

The `Arr.hasAny` method checks if at least one of the specified keys exists in the array or object.

```ts
Arr.hasAny({ name: 'Legacy', age: 25 }, ['email', 'name']);
// true
```

#### `Arr.integer`

The `Arr.integer` method retrieves a value from an array/object using dot notation, throws if value is not an integer

```ts
const data = { user: { name: 'join', id: 22 } };

Arr.integer(data, 'user.id');
// 1.5
```

#### `Arr.where`

The `Arr.where` method filters the array using the given callback, returning all elements that pass the test.

```ts
Arr.where([1, 2, 3, 4], (n) => n > 2);
// [3, 4]
```

#### `Arr.whereNotNull`

The `Arr.whereNotNull` method removes all `null` and `undefined` values from an array.

```ts
Arr.whereNotNull([1, null, 2, undefined, 3]);
// [1, 2, 3]
```

#### `Arr.unique`

The `Arr.unique` method returns all unique items from an array, preserving order.

```ts
Arr.unique([1, 1, 2, 3, 3]);
// [1, 2, 3]
```

#### `Arr.map`

The `Arr.map` method applies a given callback to each item in the array and returns a new array of results.

```ts
Arr.map([1, 2, 3], (n) => n * 2);
// [2, 4, 6]
```

#### `Arr.mapWithKeys`

The `Arr.mapWithKeys` method maps each element to a key-value pair.

```ts
Arr.mapWithKeys([{ id: 1, name: 'A' }], (x) => [x.id, x.name]);
// { '1': 'A' }
```

#### `Arr.flatten`

The `Arr.flatten` method flattens a multi-dimensional array into a single level.
You may specify a depth to control how deep the flattening should go.

```ts
Arr.flatten([1, [2, [3, [4]]]], 2);
// [1, 2, 3, [4]]
```

#### `Arr.collapse`

The `Arr.collapse` method flattens an array of arrays into a single array.

```ts
Arr.collapse([
  [1, 2],
  [3, 4],
]);
// [1, 2, 3, 4]
```

#### `Arr.combine`

The `Arr.combine` Combine arrays and sum their values element by element.

```ts
Arr.combine([10, 1], [5, 25]);
// 41
```

#### `Arr.divide`

The `Arr.divide` method returns two arrays — one containing the keys and the other containing the values.

```ts
Arr.divide({ name: 'Legacy', age: 25 });
// [['name', 'age'], ['Legacy', 25]]
```

#### `Arr.dot`

The `Arr.dot` method flattens a multi-dimensional array or object into a single-level object using “dot” notation.

```ts
Arr.dot({ user: { profile: { name: 'Legacy' } } });
// { 'user.profile.name': 'Legacy' }
```

#### `Arr.keyby`

The `Arr.keyby` method creates an object indexed by a key or callback function.

```ts
Arr.keyBy([{ id: 1 }, { id: 2 }], 'id');
// { '1': {id:1}, '2': {id:2} }
```

#### `Arr.sort`

The `Arr.sort` method sorts an array by its values. If a callback is provided, the callback’s return value determines the sort order.

```ts
Arr.sort([3, 1, 2]);
// [1, 2, 3]
```

#### `Arr.sortDesc`

The `Arr.sortDesc` method sorts an array in descending order. Like `Arr.sort`, you may provide a callback to customize sorting.

```ts
Arr.sortDesc([1, 2, 3]);
// [3, 2, 1]
```

#### `Arr.shuffle`

The `Arr.shuffle` method randomly shuffles the items in an array.

```ts
Arr.shuffle([1, 2, 3, 4]);
// [3, 1, 4, 2] // random order
```

#### `Arr.chunk`

The `Arr.chunk` method breaks an array into smaller arrays of a given size.

```ts
Arr.chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]
```

#### `Arr.wrap`

The `Arr.wrap` method wraps the given value in an array. If the value is already an array, it is returned unchanged.

```ts
Arr.wrap('Legacy');
// ['Legacy']
```

#### `Arr.random`

The `Arr.random` method returns one or more random elements from an array.

```ts
Arr.random([1, 2, 3, 4]);
// 3

Arr.random([1, 2, 3, 4], 2);
// [2, 4]
```

#### `Arr.forget`

The `Arr.forget` method removes one or more items from a deeply nested array or object using “dot” notation.

```ts
const data = { user: { profile: { name: 'Legacy', age: 25 } } };

Arr.forget(data, 'user.profile.age');
// { user: { profile: { name: 'Legacy' } } }
```

#### `Arr.pull`

The `Arr.pull` method retrieves a value from a given key and then removes it from the array or object.

```ts
const data = { name: 'Legacy', age: 25 };

Arr.pull(data, 'age');
// 25
// data => { name: 'Legacy' }
```

#### `Arr.add`

The `Arr.add` method adds a key-value pair to the array if the specified key does not already exist.

```ts
Arr.add({ name: 'Legacy' }, 'age', 25);
// { name: 'Legacy', age: 25 }
```

#### `Arr.prepend`

The `Arr.prepend` method adds an item to the beginning of an array, optionally using a key.

```ts
Arr.prepend([2, 3], 1);
// [1, 2, 3]
```

#### `Arr.push`

The `Arr.push` method appends a value to the end of the array.

```ts
Arr.push([1, 2], 3);
// [1, 2, 3]
```

#### `Arr.crossJoin`

The `Arr.crossJoin` method performs a cross join across multiple arrays, returning all possible combinations.

```ts
Arr.crossJoin([1, 2], ['a', 'b']);
// [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
```

#### `Arr.range`

The `Arr.range` method creates an array containing a range of numbers.

```ts
Arr.range(1, 5);
// [1, 2, 3, 4, 5]
```

#### `Arr.reverse`

The `Arr.reverse` method creates a new array in reverse order.

```ts
Arr.reverse([1, 2, 3, 4, 5]);
// [5, 4, 3, 1, 1]
```

#### `Arr.string`

The `Arr.string` method retrieves a value using dot notation, throws if value is not a string

```ts
const data = { user: { name: 'John', verified: true } };

Arr.string(data, 'user.name');
// 'John'
```

#### `Arr.take`

The `Arr.take` method returns the first `N` elements of an array

```ts
const data = [22, 19, 33, 6, 44];

Arr.take(data, 3);
// [22, 19, 33]
```

### Numbers [DOCS WIP]

|                               |                                 |                         |
| ----------------------------- | ------------------------------- | ----------------------- |
| [`abbreviate()`](#abbreviate) | [`toHumanTime()`](#tohumantime) | [`toBytes()`](#tobytes) |
| [`humanize()`](#humanize)     |                                 |                         |

### Paths [DOCS WIP]

### URLs [DOCS WIP]

## `abbreviate()`

Abbreviates large numbers using SI symbols (K, M, B, T, P, E) and formats the output according to the specified locale. Perfect for displaying large numbers in dashboards, statistics, and social media counters.

### Signature

```typescript
abbreviate(value?: number, locale?: string): string
```

### Parameters

- `value` (optional) - The number to abbreviate
- `locale` (optional) - Locale string for number formatting (default: `"en-US"`)

### Returns

`string` - A localized, abbreviated number string

### Abbreviation Scale

| Value Range                | Symbol | Name      |
| -------------------------- | ------ | --------- |
| 1,000+                     | K      | Thousand  |
| 1,000,000+                 | M      | Million   |
| 1,000,000,000+             | B      | Billion   |
| 1,000,000,000,000+         | T      | Trillion  |
| 1,000,000,000,000,000+     | P      | Petillion |
| 1,000,000,000,000,000,000+ | E      | Exillion  |

### Examples

#### Basic Usage

```typescript
import { abbreviate } from '@h3ravel/support';

abbreviate(500); // "500"
abbreviate(1000); // "1K"
abbreviate(1500); // "1.5K"
abbreviate(1000000); // "1M"
abbreviate(2500000); // "2.5M"
abbreviate(1000000000); // "1B"
abbreviate(7800000000); // "7.8B"
```

#### With Different Locales

```typescript
import { abbreviate } from '@h3ravel/support';

// US English (default)
abbreviate(1234567, 'en-US'); // "1.23M"

// German
abbreviate(1234567, 'de-DE'); // "1,23M"

// French
abbreviate(1234567, 'fr-FR'); // "1,23M"

// Indian English
abbreviate(1234567, 'en-IN'); // "1.23M"
```

#### Dashboard Statistics

```typescript
import { abbreviate } from '@h3ravel/support';

const stats = {
  users: 45678,
  pageViews: 1234567,
  revenue: 9876543,
};

console.log(`Users: ${abbreviate(stats.users)}`); // "Users: 45.68K"
console.log(`Views: ${abbreviate(stats.pageViews)}`); // "Views: 1.23M"
console.log(`Revenue: ${abbreviate(stats.revenue)}`); // "Revenue: 9.88M"
```

#### Handling Edge Cases

```typescript
import { abbreviate } from '@h3ravel/support';

abbreviate(); // "0"
abbreviate(0); // "0"
abbreviate(undefined); // "0"
abbreviate(999); // "999"
```

## `humanize()`

Converts a number into its written word representation. Supports numbers from 0 to 9999 and can optionally format output as a slug.

### Signature

```typescript
humanize(num: number, slugify?: '-' | '_'): string
```

### Parameters

- `num` - The number to convert (supports 0-9999)
- `slugify` (optional) - If provided (`'-'` or `'_'`), converts output to lowercase slug format

### Returns

`string` - The number written in words (or as a slug if specified)

### Examples

#### Basic Usage

```typescript
import { humanize } from '@h3ravel/support';

humanize(0); // "zero"
humanize(1); // "one"
humanize(15); // "fifteen"
humanize(42); // "forty two"
humanize(100); // "one hundred"
humanize(256); // "two hundred and fifty six"
humanize(1000); // "one thousand"
humanize(1234); // "one thousand two hundred and thirty four"
```

#### Small Numbers

```typescript
import { humanize } from '@h3ravel/support';

humanize(1); // "one"
humanize(5); // "five"
humanize(10); // "ten"
humanize(19); // "nineteen"
```

#### Tens and Twenties

```typescript
import { humanize } from '@h3ravel/support';

humanize(20); // "twenty "
humanize(25); // "twenty five"
humanize(30); // "thirty "
humanize(99); // "ninety nine"
```

#### Hundreds

```typescript
import { humanize } from '@h3ravel/support';

humanize(100); // "one hundred"
humanize(200); // "two hundred"
humanize(350); // "three hundred and fifty "
humanize(999); // "nine hundred and ninety nine"
```

#### Thousands

```typescript
import { humanize } from '@h3ravel/support';

humanize(1000); // "one thousand"
humanize(2000); // "two thousand"
humanize(1050); // "one thousand and fifty "
humanize(5678); // "five thousand six hundred and seventy eight"
```

#### Slugified Output

```typescript
import { humanize } from '@h3ravel/support';

// Using hyphen separator
humanize(42, '-'); // "forty-two"
humanize(100, '-'); // "one-hundred"
humanize(1234, '-'); // "one-thousand-two-hundred-and-thirty-four"

// Using underscore separator
humanize(42, '_'); // "forty_two"
humanize(100, '_'); // "one_hundred"
humanize(1234, '_'); // "one_thousand_two_hundred_and_thirty_four"
```

#### Practical Use Cases

```typescript
import { humanize } from '@h3ravel/support';

// Generate readable IDs
const orderId = humanize(42, '-'); // "forty-two"

// Create URL-friendly routes
const pageNum = 5;
const route = `/page-${humanize(pageNum, '-')}`; // "/page-five"

// Display amounts in words
const quantity = 15;
console.log(`You have ${humanize(quantity)} items`); // "You have fifteen items"
```

#### Error Handling

```typescript
import { humanize } from '@h3ravel/support';

humanize(0); // "zero"

// Negative numbers throw an error
try {
  humanize(-5);
} catch (error) {
  console.error(error.message); // "Negative numbers are not supported."
}
```

## `toBytes()`

Converts a number of bytes into a human-readable file size string. Supports both binary (1024-based) and SI (1000-based) units.

### Signature

```typescript
toBytes(bytes?: number, decimals?: number, bits?: boolean): string
```

### Parameters

- `bytes` (optional) - The size in bytes to convert
- `decimals` (optional) - Number of decimal places to display (default: `2`)
- `bits` (optional) - If `true`, uses SI units (1000-based); if `false`, uses binary units (1024-based) (default: `false`)

### Returns

`string` - A formatted string with the appropriate unit

### Unit Systems

**Binary Units (1024-based)** - Default

- Bytes, KiB, MiB, GiB, TiB, PiB, EiB, ZiB, YiB

**SI Units (1000-based)** - When `bits = true`

- B, KB, MB, GB, TB, PB, EB, ZB, YB

### Examples

#### Basic Usage (Binary Units)

```typescript
import { toBytes } from '@h3ravel/support';

toBytes(0); // "0 Bytes"
toBytes(1024); // "1 KiB"
toBytes(1048576); // "1 MiB"
toBytes(1073741824); // "1 GiB"
toBytes(1099511627776); // "1 TiB"
```

#### With Decimal Precision

```typescript
import { toBytes } from '@h3ravel/support';

toBytes(1536, 2); // "1.5 KiB"
toBytes(1536, 0); // "2 KiB"
toBytes(1536, 3); // "1.500 KiB"
toBytes(2500000, 1); // "2.4 MiB"
```

#### SI Units (1000-based)

```typescript
import { toBytes } from '@h3ravel/support';

toBytes(1000, 2, true); // "1 KB"
toBytes(1000000, 2, true); // "1 MB"
toBytes(1000000000, 2, true); // "1 GB"
toBytes(2500000, 2, true); // "2.5 MB"
```

#### File Size Display

```typescript
import { toBytes } from '@h3ravel/support';

const files = [
  { name: 'document.pdf', size: 2458624 },
  { name: 'image.jpg', size: 524288 },
  { name: 'video.mp4', size: 157286400 },
];

files.forEach((file) => {
  console.log(`${file.name}: ${toBytes(file.size)}`);
});
// Output:
// document.pdf: 2.34 MiB
// image.jpg: 512 KiB
// video.mp4: 150 MiB
```

#### Download Progress

```typescript
import { toBytes } from '@h3ravel/support';

const downloaded = 45678901;
const total = 104857600;

console.log(`Downloaded: ${toBytes(downloaded)} / ${toBytes(total)}`);
// "Downloaded: 43.56 MiB / 100 MiB"
```

#### Edge Cases

```typescript
import { toBytes } from '@h3ravel/support';

toBytes(); // "0 Bytes"
toBytes(0); // "0 Bytes"
toBytes(undefined); // "0 Bytes"
toBytes(NaN); // "0 Bytes"
toBytes(500); // "500 Bytes"
```

## `toHumanTime()`

Formats a duration in seconds into a human-readable time string. Supports both worded format (e.g., "1hr 2min 3sec") and digital clock format (e.g., "01:02:03").

### Signature

```typescript
toHumanTime(seconds?: number, worded?: boolean): string
```

### Parameters

- `seconds` (optional) - Duration in seconds (default: `0`)
- `worded` (optional) - If `true`, outputs worded format; if `false`, outputs HH:MM:SS format (default: `false`)

### Returns

`string` - A formatted time string

### Examples

#### Digital Clock Format (Default)

```typescript
import { toHumanTime } from '@h3ravel/support';

toHumanTime(0); // "0:00"
toHumanTime(30); // "0:30"
toHumanTime(90); // "1:30"
toHumanTime(3600); // "1:00:00"
toHumanTime(3661); // "1:01:01"
toHumanTime(7384); // "2:03:04"
```

#### Worded Format

```typescript
import { toHumanTime } from '@h3ravel/support';

toHumanTime(0, true); // "0sec"
toHumanTime(30, true); // "30sec"
toHumanTime(90, true); // "1min 30sec"
toHumanTime(3600, true); // "1hr"
toHumanTime(3661, true); // "1hr 1min 1sec"
toHumanTime(7384, true); // "2hr 3min 4sec"
```

#### Video Duration Display

```typescript
import { toHumanTime } from '@h3ravel/support';

const videoDuration = 185; // 3 minutes 5 seconds

// Digital format for video player
console.log(toHumanTime(videoDuration)); // "3:05"

// Worded format for descriptions
console.log(toHumanTime(videoDuration, true)); // "3min 5sec"
```

#### Timer Display

```typescript
import { toHumanTime } from '@h3ravel/support';

let elapsed = 0;

setInterval(() => {
  elapsed++;
  console.log(`Elapsed: ${toHumanTime(elapsed)}`);
}, 1000);
// Output: "0:01", "0:02", "0:03", ...
```

#### Exercise Tracker

```typescript
import { toHumanTime } from '@h3ravel/support';

const workoutDuration = 4567; // ~76 minutes

console.log(`Workout duration: ${toHumanTime(workoutDuration, true)}`);
// "Workout duration: 1hr 16min 7sec"
```

#### Different Time Ranges

```typescript
import { toHumanTime } from '@h3ravel/support';

// Seconds only
toHumanTime(45); // "0:45"
toHumanTime(45, true); // "45sec"

// Minutes and seconds
toHumanTime(125); // "2:05"
toHumanTime(125, true); // "2min 5sec"

// Hours, minutes, and seconds
toHumanTime(4505); // "1:15:05"
toHumanTime(4505, true); // "1hr 15min 5sec"

// Multiple hours
toHumanTime(36000); // "10:00:00"
toHumanTime(36000, true); // "10hr"
```

#### Edge Cases

```typescript
import { toHumanTime } from '@h3ravel/support';

toHumanTime(); // "0:00"
toHumanTime(0); // "0:00"
toHumanTime(0, true); // "0sec"
toHumanTime(-100); // "0:00" (negative values treated as 0)
toHumanTime(NaN); // "0:00"
```

## Comparison Table

| Helper          | Input   | Output Example | Use Case                      |
| --------------- | ------- | -------------- | ----------------------------- |
| `abbreviate()`  | 1234567 | "1.23M"        | Large numbers, statistics     |
| `humanize()`    | 42      | "forty two"    | Written numbers, readable IDs |
| `toBytes()`     | 1048576 | "1 MiB"        | File sizes, storage           |
| `toHumanTime()` | 3661    | "1:01:01"      | Durations, timers             |

## Usage Tips

### 1. **Choose the Right Helper**

```typescript
import { abbreviate, toBytes, toHumanTime } from '@h3ravel/support';

// For large counts/stats → abbreviate()
const followers = 1543678;
console.log(abbreviate(followers)); // "1.54M"

// For file/data sizes → toBytes()
const fileSize = 5242880;
console.log(toBytes(fileSize)); // "5 MiB"

// For time durations → toHumanTime()
const duration = 3725;
console.log(toHumanTime(duration)); // "1:02:05"
```

### 2. **Locale-Aware Formatting**

```typescript
import { abbreviate } from '@h3ravel/support';

// Adapt to user's locale
const userLocale = navigator.language || 'en-US';
const count = 1234567;

console.log(abbreviate(count, userLocale));
```

### 3. **Consistent Decimal Places**

```typescript
import { toBytes } from '@h3ravel/support';

// Use consistent decimals for better UX
const files = [1024, 2048, 4096];

files.forEach((size) => {
  console.log(toBytes(size, 2)); // Always 2 decimal places
});
// Output: "1.00 KiB", "2.00 KiB", "4.00 KiB"
```

### 4. **Dynamic Time Format**

```typescript
import { toHumanTime } from '@h3ravel/support';

// Use worded format for natural language
const duration = 125;
console.log(`Video length: ${toHumanTime(duration, true)}`);
// "Video length: 2min 5sec"

// Use digital format for UI elements
console.log(`Duration: ${toHumanTime(duration)}`);
// "Duration: 2:05"
```

### 5. **Error Handling**

```typescript
import { humanize, toBytes, toHumanTime } from '@h3ravel/support';

// humanize() throws on negative numbers
try {
  humanize(-5);
} catch (error) {
  console.error('Invalid input');
}

// Other helpers handle invalid input gracefully
console.log(toBytes(undefined)); // "0 Bytes"
console.log(toHumanTime(NaN)); // "0:00"
```

## TypeScript Support

All Number helpers are fully typed and provide excellent TypeScript support:

```typescript
import { abbreviate, humanize, toBytes, toHumanTime } from '@h3ravel/support';

// Type inference works automatically
const abbreviated: string = abbreviate(1000000);
const words: string = humanize(42);
const size: string = toBytes(1024);
const time: string = toHumanTime(3600);

// Optional parameters are type-safe
abbreviate(1000, 'en-US'); // Valid
humanize(100, '-'); // Valid
humanize(100, '/'); // Type error
toBytes(1024, 2, true); // Valid
toHumanTime(60, true); // Valid
```

<style>
.vp-doc thead {
  display: none;
}
.vp-doc tbody {
  display: table;
  width: 100%;
}
.vp-doc td {
  border: none;
}
.vp-doc tr {
    border: none !important;
    background-color: transparent !important;
}
</style>
