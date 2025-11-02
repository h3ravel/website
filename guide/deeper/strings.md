# Strings

## Introduction

H3ravel provides an extensive collection of framework agnostic string manipulation utilities inspired by Laravel's string helpers via the `@h3ravel/support` package. These helpers make it easy to work with strings in TypeScript/JavaScript applications, many of them are also used within the framework itself; however, you are free to use them in your own applications if you find them convenient.

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

### Strings

|                               |                                               |                             |
| ----------------------------- | --------------------------------------------- | --------------------------- |
| [`after()`](#after)           | [`split()`](#split)                           | [`padString()`](#padstring) |
| [`afterLast()`](#afterlast)   | [`singularize()`](#singularize)               | [`pluralize()`](#pluralize) |
| [`before()`](#before)         | [`slugify()`](#slugify)                       | [`translate()`](#translate) |
| [`beforeLast()`](#beforelast) | [`subString()`](#substring)                   |
| [`capitalize()`](#capitalize) | [`substitute()`](#substitute)                 |                             |
| [`chop()`](#chop)             | [`truncate()`](#truncate)                     |                             |
| [`esc()`](#esc)               | [`substr()`](#substr)                         |                             |
| [`isInteger()`](#isinteger)   | [`sub()`](#sub)                               |                             |
| [`isNumber()`](#isnumber)     | [`ss()`](#ss)                                 |                             |
| [`firstLines()`](#firstlines) | [`rot()`](#rot)                               |                             |
| [`lastLines()`](#lastlines)   | [`replacePunctuation()`](#replacepunctuation) |                             |

## Fluent Strings [ DOC WIP ]

Use `Str.of()` for fluent chaining

## Additional String Helpers

The `Str` class includes many more helpers. Here's a quick reference:

### Case Conversion

- `camel()` - Convert to camelCase
- `kebab()` - Convert to kebab-case
- `snake()` - Convert to snake_case
- `studly()` / `pascal()` - Convert to PascalCase
- `title()` - Convert to Title Case
- `lower()` / `upper()` - Convert case
- `lcfirst()` / `ucfirst()` - First character case

### String Manipulation

- `append()` / `prepend()` - Add to start/end
- `wrap()` / `unwrap()` - Wrap with strings
- `trim()` / `ltrim()` / `rtrim()` - Remove whitespace
- `replace()` / `replaceFirst()` / `replaceLast()` - Replace text
- `remove()` - Remove occurrences
- `reverse()` - Reverse string
- `repeat()` - Repeat string

### String Testing

- `contains()` / `containsAll()` - Check if contains
- `startsWith()` / `endsWith()` - Check start/end
- `is()` / `isMatch()` - Pattern matching
- `isAscii()` / `isJson()` / `isUrl()` / `isUuid()` - Type checking

### String Extraction

- `match()` / `matchAll()` - Extract with regex
- `between()` / `betweenFirst()` - Extract between markers
- `excerpt()` - Extract excerpt around phrase
- `mask()` - Mask portion of string

### Utility

- `length()` - Get string length
- `position()` - Find position of substring
- `wordCount()` - Count words
- `words()` - Limit word count
- `numbers()` - Extract only numbers

## `after()`

Returns the remainder of a string after the first occurrence of a given value.

### Signature

```typescript
Str.after(subject: string, search: string): string
```

### Parameters

- `subject` - The string to search in
- `search` - The value to search for

### Returns

`string` - Portion of string after the search value

### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.after('user@example.com', '@');
// "example.com"

Str.after('Hello World', 'Hello ');
// "World"

Str.after('path/to/file.txt', '/');
// "to/file.txt"

// If search string not found, returns original string
Str.after('Hello', 'xyz');
// "Hello"

// Empty search returns original string
Str.after('Hello', '');
// "Hello"
```

## `afterLast()`

Returns the remainder of a string after the last occurrence of a given value.

### Signature

```typescript
Str.afterLast(subject: string, search: string): string
```

### Parameters

- `subject` - The string to search in
- `search` - The value to search for

### Returns

`string` - Portion of string after the last occurrence

### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.afterLast('path/to/file.txt', '/');
// "file.txt"

Str.afterLast('user@mail.example.com', '.');
// "com"

Str.afterLast('App\\Controllers\\HomeController', '\\');
// "HomeController"

// If not found, returns original string
Str.afterLast('Hello', 'xyz');
// "Hello"
```

## `before()`

Gets the portion of a string before the first occurrence of a given value.

### Signature

```typescript
Str.before(subject: string, search: string): string
```

### Parameters

- `subject` - The string to search in
- `search` - The value to search for

### Returns

`string` - Portion of string before the search value

### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.before('user@example.com', '@');
// "user"

Str.before('Hello World', ' ');
// "Hello"

Str.before('path/to/file.txt', '/');
// "path"

// If not found, returns original string
Str.before('Hello', 'xyz');
// "Hello"
```

## `beforeLast()`

Gets the portion of a string before the last occurrence of a given value.

### Signature

```typescript
Str.beforeLast(subject: string, search: string): string
```

### Parameters

- `subject` - The string to search in
- `search` - The value to search for

### Returns

`string` - Portion of string before the last occurrence

### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.beforeLast('path/to/file.txt', '/');
// "path/to"

Str.beforeLast('user@mail.example.com', '.');
// "user@mail.example"

Str.beforeLast('App\\Controllers\\HomeController', '\\');
// "App\\Controllers"
```

## `capitalize()`

Uppercases the first character of each word in a string.

### Signature

```typescript
Str.capitalize(string: string, separators?: string): string
```

### Parameters

- `string` - The input string
- `separators` (optional) - Word separator characters (default: `' \t\r\n\f\v'`)

### Returns

`string` - The capitalized string

### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.capitalize('hello world');
// "Hello World"

Str.capitalize('the quick brown fox');
// "The Quick Brown Fox"

Str.capitalize('john-doe', '-');
// "John-Doe"

Str.capitalize('user_name_here', '_');
// "User_Name_Here"
```

**Alias:** `ucwords()` performs the same operation.

## `pluralize()`

Gets the plural form of an English word.

### Signature

```typescript
Str.pluralize(value: string, count?: number | number[]): string
```

### Parameters

- `value` - The word to pluralize
- `count` (optional) - If 1, returns singular; otherwise plural (default: `2`)

### Returns

`string` - The plural form of the word

### Examples

```typescript
import { Str } from '@h3ravel/support';

// Basic pluralization
Str.pluralize('car'); // "cars"
Str.pluralize('person'); // "people"
Str.pluralize('child'); // "children"
Str.pluralize('tooth'); // "teeth"
Str.pluralize('mouse'); // "mice"

// Conditional pluralization
Str.pluralize('item', 1); // "item" (singular)
Str.pluralize('item', 2); // "items" (plural)
Str.pluralize('item', 0); // "items" (plural)

// Complex words
Str.pluralize('category'); // "categories"
Str.pluralize('index'); // "indices"
Str.pluralize('status'); // "statuses"
Str.pluralize('bus'); // "buses"
Str.pluralize('knife'); // "knives"

// Uncountable words
Str.pluralize('sheep'); // "sheep"
Str.pluralize('fish'); // "fish"
Str.pluralize('information'); // "information"
```

**Alias:** `plural()` performs the same operation.

## `singularize()`

Gets the singular form of an English word.

### Signature

```typescript
Str.singularize(value: string): string
```

### Parameters

- `value` - The word to singularize

### Returns

`string` - The singular form of the word

### Examples

```typescript
import { Str } from '@h3ravel/support';

// Basic singularization
Str.singularize('cars'); // "car"
Str.singularize('people'); // "person"
Str.singularize('children'); // "child"
Str.singularize('teeth'); // "tooth"
Str.singularize('mice'); // "mouse"

// Complex words
Str.singularize('categories'); // "category"
Str.singularize('indices'); // "index"
Str.singularize('statuses'); // "status"
Str.singularize('buses'); // "bus"
Str.singularize('knives'); // "knife"

// Uncountable words
Str.singularize('sheep'); // "sheep"
Str.singularize('fish'); // "fish"
Str.singularize('information'); // "information"
```

**Alias:** `singular()` performs the same operation.

## `slugify()`

Generates a URL-friendly "slug" from a given string.

### Signature

```typescript
Str.slugify(title: string, separator?: string, dictionary?: { [key: string]: string }): string
```

### Parameters

- `title` - The string to convert to a slug
- `separator` (optional) - The separator character (default: `'-'`)
- `dictionary` (optional) - Custom character replacements (default: `{ '@': 'at' }`)

### Returns

`string` - The slugified string

### Examples

```typescript
import { Str } from '@h3ravel/support';

// Basic slugification
Str.slugify('Hello World');
// "hello-world"

Str.slugify('The Quick Brown Fox');
// "the-quick-brown-fox"

// Custom separator
Str.slugify('Hello World', '_');
// "hello_world"

// Custom dictionary
Str.slugify('user@example.com', '-', { '@': 'at', '.': 'dot' });
// "user-at-example-dot-com"

// Handles special characters
Str.slugify('Hello & Goodbye!');
// "hello-goodbye"

Str.slugify('Price: $19.99');
// "price-1999"
```

**Alias:** `slug()` performs the same operation.

## `subString()`

An alias for the `substr()` method. See [`substr()`](#substr) for details.

## `substitute()`

Substitutes placeholders `{key}` in a string using object values with dot notation support.

### Signature

```typescript
Str.substitute(str: string, data?: Record<string, unknown>, def?: string): string | undefined
```

### Parameters

- `str` - The template string with placeholders
- `data` (optional) - Object with replacement values
- `def` (optional) - Default value for missing keys

### Returns

`string | undefined` - The substituted string, or `undefined` if inputs are invalid

### Examples

```typescript
import { Str } from '@h3ravel/support';

// Basic substitution
Str.substitute('Hello {name}!', { name: 'John' });
// "Hello John!"

// Dot notation support
Str.substitute('Welcome {user.name}', {
  user: { name: 'Alice', age: 25 },
});
// "Welcome Alice"

// Multiple placeholders
Str.substitute('{greeting} {user.name}, you are {user.age} years old', {
  greeting: 'Hello',
  user: { name: 'Bob', age: 30 },
});
// "Hello Bob, you are 30 years old"

// Default value for missing keys
Str.substitute('Hello {name}!', {}, 'Guest');
// "Hello Guest!"

// Missing key without default
Str.substitute('Hello {name}!', {});
// "Hello !"
```

## `truncate()`

Limits the number of characters in a string. This is an alias for `limit()`.

### Signature

```typescript
Str.truncate(value: string, limit?: number, end?: string, preserveWords?: boolean): string
```

### Parameters

- `value` - The string to truncate
- `limit` (optional) - Maximum length (default: `100`)
- `end` (optional) - Ending string (default: `'...'`)
- `preserveWords` (optional) - Preserve word boundaries (default: `false`)

### Returns

`string` - The truncated string

### Examples

```typescript
import { Str } from '@h3ravel/support';

// Basic truncation
Str.truncate('The quick brown fox jumps over the lazy dog', 20);
// "The quick brown fox..."

// Custom ending
Str.truncate('Hello World', 8, '---');
// "Hello---"

// Preserve words
Str.truncate('The quick brown fox', 12, '...', true);
// "The quick..."

// Strip HTML tags
Str.truncate('<p>Hello <strong>World</strong></p>', 8);
// "Hello Wo..."
```

## `substr()`

Returns the portion of string specified by start and length parameters.

### Signature

```typescript
Str.substr(string: string, start: number, length?: number | null): string
```

### Parameters

- `string` - The input string
- `start` - Starting position (negative counts from end)
- `length` (optional) - Maximum length to return (default: rest of string)

### Returns

`string` - The extracted substring

### Examples

```typescript
import { Str } from '@h3ravel/support';

// Extract from position
Str.substr('Hello World', 0, 5);
// "Hello"

Str.substr('Hello World', 6);
// "World"

// Negative start (from end)
Str.substr('Hello World', -5);
// "World"

Str.substr('Hello World', -5, 3);
// "Wor"

// No length specified
Str.substr('abcdef', 2);
// "cdef"
```

## `sub()`

Gets substring by start and stop indexes.

### Signature

```typescript
Str.sub(string: string, start: number, stop: number): string
```

### Parameters

- `string` - The input string
- `start` - Starting index
- `stop` - Ending index

### Returns

`string` - The extracted substring

### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.sub('Hello World', 0, 5);
// "Hello"

Str.sub('Hello World', 6, 11);
// "World"

Str.sub('JavaScript', 4, 10);
// "Script"
```

## `esc()`

Escapes a string for JSON encoding (returns string without quotes).

### Signature

```typescript
Str.esc(string: string): string
```

### Parameters

- `string` - The string to escape

### Returns

`string` - The escaped string

### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.esc('Hello "World"');
// 'Hello \\"World\\"'

Str.esc("It's a test");
// "It's a test"

Str.esc('Line 1\nLine 2');
// 'Line 1\\nLine 2'

Str.esc('Path: C:\\Users\\');
// 'Path: C:\\\\Users\\\\'
```

## `padString()`

Pads a string. See individual methods:

- [`padLeft()`](#padleft) - Pad left side
- [`padRight()`](#padright) - Pad right side
- [`padBoth()`](#padboth) - Pad both sides

### `padLeft()`

Pads the left side of a string with another string.

```typescript
Str.padLeft(value: string, length: number, pad?: string): string
```

#### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.padLeft('5', 3, '0');
// "005"

Str.padLeft('test', 10);
// "      test"

Str.padLeft('42', 5, '*');
// "***42"
```

### `padRight()`

Pads the right side of a string with another string.

```typescript
Str.padRight(value: string, length: number, pad?: string): string
```

#### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.padRight('5', 3, '0');
// "500"

Str.padRight('test', 10);
// "test      "

Str.padRight('42', 5, '*');
// "42***"
```

### `padBoth()`

Pads both sides of a string with another string.

```typescript
Str.padBoth(value: string, length: number, pad?: string): string
```

#### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.padBoth('test', 10);
// "   test   "

Str.padBoth('42', 6, '0');
// "004200"

Str.padBoth('Hi', 10, '-');
// "----Hi----"
```

## `split()`

Splits a string using a regular expression or delimiter.

### Signature

```typescript
Str.split(pattern: string, limit?: number): string[]
// When using with Stringable:
stringable.split(pattern: string, limit?: number): string[]
```

### Parameters

- `pattern` - Regular expression pattern or delimiter
- `limit` (optional) - Maximum number of splits (default: `-1` for no limit)

### Returns

`string[]` - Array of string segments

### Examples

```typescript
import { Str } from '@h3ravel/support';

// Using Stringable
const str = Str.of('apple,banana,cherry');

str.split(',');
// ["apple", "banana", "cherry"]

str.split(',', 2);
// ["apple", "banana,cherry"]

// With regex pattern
Str.of('one1two2three3').split('/\\d+/');
// ["one", "two", "three"]

// Split on whitespace
Str.of('Hello   World  Test').split('/\\s+/');
// ["Hello", "World", "Test"]
```

## `chop()`

Returns all characters except the last one.

### Signature

```typescript
Str.chop(string: string): string
```

### Parameters

- `string` - The input string

### Returns

`string` - String without last character

### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.chop('Hello');
// "Hell"

Str.chop('test!');
// "test"

Str.chop('a');
// ""

// Common use: remove trailing punctuation
Str.chop('filename.txt');
// "filename.tx"
```

## `isNumber()`

Checks if a string is numeric.

### Signature

```typescript
Str.isNumber(string: string): boolean
```

### Parameters

- `string` - The string to check

### Returns

`boolean` - `true` if numeric, `false` otherwise

### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.isNumber('123'); // true
Str.isNumber('45.67'); // true
Str.isNumber('-89'); // true
Str.isNumber('1e10'); // true
Str.isNumber('abc'); // false
Str.isNumber('12a'); // false
Str.isNumber(''); // false
Str.isNumber('  '); // false
```

## `isInteger()`

Checks if a string is an integer.

### Signature

```typescript
Str.isInteger(string: string): boolean
```

### Parameters

- `string` - The string to check

### Returns

`boolean` - `true` if integer, `false` otherwise

### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.isInteger('123'); // true
Str.isInteger('-456'); // true
Str.isInteger('45.67'); // false
Str.isInteger('abc'); // false
Str.isInteger(''); // false
Str.isInteger('  '); // false
```

## `rot()`

Applies ROT-N cipher transformation to a string.

### Signature

```typescript
Str.rot(string: string, n?: number): string
```

### Parameters

- `string` - The string to transform
- `n` (optional) - Rotation amount (default: `13` for ROT13)

### Returns

`string` - The transformed string

### Examples

```typescript
import { Str } from '@h3ravel/support';

// ROT13 (default)
Str.rot('Hello');
// "Uryyb"

Str.rot('Uryyb'); // Decode
// "Hello"

// Custom rotation
Str.rot('abc', 1);
// "bcd"

Str.rot('xyz', 3);
// "abc"

// Only letters are affected
Str.rot('Hello123!', 13);
// "Uryyb123!"
```

## `replacePunctuation()`

Replaces trailing punctuation with new format.

### Signature

```typescript
Str.replacePunctuation(string: string, newFormat: string): string
```

### Parameters

- `string` - The input string
- `newFormat` - The new punctuation to use

### Returns

`string` - String with replaced punctuation

### Examples

```typescript
import { Str } from '@h3ravel/support';

Str.replacePunctuation('Hello.', '!');
// "Hello!"

Str.replacePunctuation('What???', '.');
// "What."

Str.replacePunctuation('Test...', '!');
// "Test!"

Str.replacePunctuation('No punctuation', '.');
// "No punctuation."
```

## `translate()`

Array/object driven text replacement.

### Signature

```typescript
Str.translate(string: string, replacements: Record<string, string> | Array<[string, string]>): string
```

### Parameters

- `string` - The input string
- `replacements` - Object or array of replacement pairs

### Returns

`string` - String with replacements applied

### Examples

```typescript
import { Str } from '@h3ravel/support';

// Object replacements
Str.translate('Hello World', { Hello: 'Hi', World: 'There' });
// "Hi There"

// Array replacements
Str.translate('foo bar baz', [
  ['foo', 'one'],
  ['bar', 'two'],
  ['baz', 'three'],
]);
// "one two three"

// With regex patterns
Str.translate('test123test', { '\\d+': 'NUM' });
// "testNUMtest"
```

## `ss()`

Strips slashes recursively from a string.

### Signature

```typescript
Str.ss(string: string): string
```

### Parameters

- `string` - The input string

### Returns

`string` - String with slashes removed

### Examples

```typescript
import { Str } from '@h3ravel/support'

Str.ss('Hello\\ World')
// "Hello World"

Str.ss('C:\\\\Users\\\\Name')
// "C:UsersName"

Str.ss('It\\'s a test')
// "It's a test"

Str.ss('Quote: \\"text\\"')
// 'Quote: "text"'
```

## `firstLines()`

Gets the first N lines of a string.

### Signature

```typescript
Str.firstLines(string: string, amount?: number): string
```

### Parameters

- `string` - The input string
- `amount` (optional) - Number of lines to get (default: `1`)

### Returns

`string` - The first N lines

### Examples

```typescript
import { Str } from '@h3ravel/support';

const text = 'Line 1\nLine 2\nLine 3\nLine 4';

Str.firstLines(text);
// "Line 1"

Str.firstLines(text, 2);
// "Line 1\nLine 2"

Str.firstLines(text, 3);
// "Line 1\nLine 2\nLine 3"

// Get first line of file content
Str.firstLines('# Title\n\nContent here...');
// "# Title"
```

## `lastLines()`

Gets the last N lines of a string.

### Signature

```typescript
Str.lastLines(string: string, amount?: number): string
```

### Parameters

- `string` - The input string
- `amount` (optional) - Number of lines to get (default: `1`)

### Returns

`string` - The last N lines

### Examples

```typescript
import { Str } from '@h3ravel/support';

const text = 'Line 1\nLine 2\nLine 3\nLine 4';

Str.lastLines(text);
// "Line 4"

Str.lastLines(text, 2);
// "Line 3\nLine 4"

Str.lastLines(text, 3);
// "Line 2\nLine 3\nLine 4"

// Get last line of log
Str.lastLines('Error 1\nError 2\nError 3');
// "Error 3"
```

## More Usage Examples

### URL Slug Generation

```typescript
import { Str } from '@h3ravel/support';

const title = 'How to Learn TypeScript in 2024';
const slug = Str.slugify(title);
// "how-to-learn-typescript-in-2024"
```

### Email Parsing

```typescript
import { Str } from '@h3ravel/support';

const email = 'user@example.com';
const username = Str.before(email, '@'); // "user"
const domain = Str.after(email, '@'); // "example.com"
const tld = Str.afterLast(domain, '.'); // "com"
```

### Template Replacement

```typescript
import { Str } from '@h3ravel/support';

const template = 'Hello {user.name}, you have {count} messages';
const result = Str.substitute(template, {
  user: { name: 'Alice' },
  count: 5,
});
// "Hello Alice, you have 5 messages"
```

### Text Processing

```typescript
import { Str } from '@h3ravel/support';

const text = 'The quick brown fox jumps over the lazy dog';

// Get excerpt
Str.firstLines(text, 1); // First line
Str.truncate(text, 20); // Truncate to 20 chars

// Capitalize
Str.capitalize(text); // Capitalize each word

// Count
Str.wordCount(text); // Count words
```

### Data Validation

```typescript
import { Str } from '@h3ravel/support';

// Check numeric strings
Str.isNumber('123'); // true
Str.isInteger('45.67'); // false

// Validate formats
Str.isUrl('https://example.com'); // true
Str.isJson('{"key": "value"}'); // true
```

---

## TypeScript Support

All String helpers are fully typed:

```typescript
import { Str } from '@h3ravel/support';

const result: string = Str.after('hello@world.com', '@');
const isNumeric: boolean = Str.isNumber('123');
const lines: string = Str.firstLines('line1\nline2', 1);
```

---

## Stringable Class

Most helpers can also be used via the fluent `Stringable` class:

```typescript
import { Str } from '@h3ravel/support';

Str.of('hello world').capitalize().slugify().toString();
// "Hello-World"

Str.of('  test  ').trim().upper().append('!').toString();
// "TEST!"
```

---

## Tips

1. **Pluralization**: Handles irregular words automatically
2. **Template Substitution**: Supports dot notation for nested objects
3. **ROT Cipher**: Useful for simple obfuscation (not encryption!)
4. **Line Operations**: Useful for log processing and text previews

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
