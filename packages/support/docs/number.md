# Number Helpers

The `@h3ravel/support` package provides powerful utilities for working with numbers, including formatting, abbreviation, and conversion functions. These helpers make it easy to display numbers in human-readable formats.

## Available Helpers

- [`abbreviate()`](#abbreviate) - Abbreviate large numbers with SI symbols (K, M, B, etc.)
- [`humanize()`](#humanize) - Convert numbers to written words
- [`toBytes()`](#tobytes) - Convert bytes to human-readable file sizes
- [`toHumanTime()`](#tohumantime) - Convert seconds to readable time format

---

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

| Value Range | Symbol | Name |
|------------|--------|------|
| 1,000+ | K | Thousand |
| 1,000,000+ | M | Million |
| 1,000,000,000+ | B | Billion |
| 1,000,000,000,000+ | T | Trillion |
| 1,000,000,000,000,000+ | P | Petillion |
| 1,000,000,000,000,000,000+ | E | Exillion |

### Examples

#### Basic Usage

```typescript
import { abbreviate } from '@h3ravel/support'

abbreviate(500)           // "500"
abbreviate(1000)          // "1K"
abbreviate(1500)          // "1.5K"
abbreviate(1000000)       // "1M"
abbreviate(2500000)       // "2.5M"
abbreviate(1000000000)    // "1B"
abbreviate(7800000000)    // "7.8B"
```

#### With Different Locales

```typescript
import { abbreviate } from '@h3ravel/support'

// US English (default)
abbreviate(1234567, 'en-US')    // "1.23M"

// German
abbreviate(1234567, 'de-DE')    // "1,23M"

// French
abbreviate(1234567, 'fr-FR')    // "1,23M"

// Indian English
abbreviate(1234567, 'en-IN')    // "1.23M"
```

#### Dashboard Statistics

```typescript
import { abbreviate } from '@h3ravel/support'

const stats = {
  users: 45678,
  pageViews: 1234567,
  revenue: 9876543
}

console.log(`Users: ${abbreviate(stats.users)}`)           // "Users: 45.68K"
console.log(`Views: ${abbreviate(stats.pageViews)}`)       // "Views: 1.23M"
console.log(`Revenue: ${abbreviate(stats.revenue)}`)       // "Revenue: 9.88M"
```

#### Handling Edge Cases

```typescript
import { abbreviate } from '@h3ravel/support'

abbreviate()              // "0"
abbreviate(0)             // "0"
abbreviate(undefined)     // "0"
abbreviate(999)           // "999"
```

---

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
import { humanize } from '@h3ravel/support'

humanize(0)       // "zero"
humanize(1)       // "one"
humanize(15)      // "fifteen"
humanize(42)      // "forty two"
humanize(100)     // "one hundred"
humanize(256)     // "two hundred and fifty six"
humanize(1000)    // "one thousand"
humanize(1234)    // "one thousand two hundred and thirty four"
```

#### Small Numbers

```typescript
import { humanize } from '@h3ravel/support'

humanize(1)       // "one"
humanize(5)       // "five"
humanize(10)      // "ten"
humanize(19)      // "nineteen"
```

#### Tens and Twenties

```typescript
import { humanize } from '@h3ravel/support'

humanize(20)      // "twenty "
humanize(25)      // "twenty five"
humanize(30)      // "thirty "
humanize(99)      // "ninety nine"
```

#### Hundreds

```typescript
import { humanize } from '@h3ravel/support'

humanize(100)     // "one hundred"
humanize(200)     // "two hundred"
humanize(350)     // "three hundred and fifty "
humanize(999)     // "nine hundred and ninety nine"
```

#### Thousands

```typescript
import { humanize } from '@h3ravel/support'

humanize(1000)    // "one thousand"
humanize(2000)    // "two thousand"
humanize(1050)    // "one thousand and fifty "
humanize(5678)    // "five thousand six hundred and seventy eight"
```

#### Slugified Output

```typescript
import { humanize } from '@h3ravel/support'

// Using hyphen separator
humanize(42, '-')     // "forty-two"
humanize(100, '-')    // "one-hundred"
humanize(1234, '-')   // "one-thousand-two-hundred-and-thirty-four"

// Using underscore separator
humanize(42, '_')     // "forty_two"
humanize(100, '_')    // "one_hundred"
humanize(1234, '_')   // "one_thousand_two_hundred_and_thirty_four"
```

#### Practical Use Cases

```typescript
import { humanize } from '@h3ravel/support'

// Generate readable IDs
const orderId = humanize(42, '-')  // "forty-two"

// Create URL-friendly routes
const pageNum = 5
const route = `/page-${humanize(pageNum, '-')}`  // "/page-five"

// Display amounts in words
const quantity = 15
console.log(`You have ${humanize(quantity)} items`)  // "You have fifteen items"
```

#### Error Handling

```typescript
import { humanize } from '@h3ravel/support'

humanize(0)       // "zero"

// Negative numbers throw an error
try {
  humanize(-5)
} catch (error) {
  console.error(error.message)  // "Negative numbers are not supported."
}
```

---

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
import { toBytes } from '@h3ravel/support'

toBytes(0)                    // "0 Bytes"
toBytes(1024)                 // "1 KiB"
toBytes(1048576)              // "1 MiB"
toBytes(1073741824)           // "1 GiB"
toBytes(1099511627776)        // "1 TiB"
```

#### With Decimal Precision

```typescript
import { toBytes } from '@h3ravel/support'

toBytes(1536, 2)              // "1.5 KiB"
toBytes(1536, 0)              // "2 KiB"
toBytes(1536, 3)              // "1.500 KiB"
toBytes(2500000, 1)           // "2.4 MiB"
```

#### SI Units (1000-based)

```typescript
import { toBytes } from '@h3ravel/support'

toBytes(1000, 2, true)        // "1 KB"
toBytes(1000000, 2, true)     // "1 MB"
toBytes(1000000000, 2, true)  // "1 GB"
toBytes(2500000, 2, true)     // "2.5 MB"
```

#### File Size Display

```typescript
import { toBytes } from '@h3ravel/support'

const files = [
  { name: 'document.pdf', size: 2458624 },
  { name: 'image.jpg', size: 524288 },
  { name: 'video.mp4', size: 157286400 }
]

files.forEach(file => {
  console.log(`${file.name}: ${toBytes(file.size)}`)
})
// Output:
// document.pdf: 2.34 MiB
// image.jpg: 512 KiB
// video.mp4: 150 MiB
```

#### Download Progress

```typescript
import { toBytes } from '@h3ravel/support'

const downloaded = 45678901
const total = 104857600

console.log(`Downloaded: ${toBytes(downloaded)} / ${toBytes(total)}`)
// "Downloaded: 43.56 MiB / 100 MiB"
```

#### Edge Cases

```typescript
import { toBytes } from '@h3ravel/support'

toBytes()                     // "0 Bytes"
toBytes(0)                    // "0 Bytes"
toBytes(undefined)            // "0 Bytes"
toBytes(NaN)                  // "0 Bytes"
toBytes(500)                  // "500 Bytes"
```

---

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
import { toHumanTime } from '@h3ravel/support'

toHumanTime(0)                // "0:00"
toHumanTime(30)               // "0:30"
toHumanTime(90)               // "1:30"
toHumanTime(3600)             // "1:00:00"
toHumanTime(3661)             // "1:01:01"
toHumanTime(7384)             // "2:03:04"
```

#### Worded Format

```typescript
import { toHumanTime } from '@h3ravel/support'

toHumanTime(0, true)          // "0sec"
toHumanTime(30, true)         // "30sec"
toHumanTime(90, true)         // "1min 30sec"
toHumanTime(3600, true)       // "1hr"
toHumanTime(3661, true)       // "1hr 1min 1sec"
toHumanTime(7384, true)       // "2hr 3min 4sec"
```

#### Video Duration Display

```typescript
import { toHumanTime } from '@h3ravel/support'

const videoDuration = 185  // 3 minutes 5 seconds

// Digital format for video player
console.log(toHumanTime(videoDuration))           // "3:05"

// Worded format for descriptions
console.log(toHumanTime(videoDuration, true))     // "3min 5sec"
```

#### Timer Display

```typescript
import { toHumanTime } from '@h3ravel/support'

let elapsed = 0

setInterval(() => {
  elapsed++
  console.log(`Elapsed: ${toHumanTime(elapsed)}`)
}, 1000)
// Output: "0:01", "0:02", "0:03", ...
```

#### Exercise Tracker

```typescript
import { toHumanTime } from '@h3ravel/support'

const workoutDuration = 4567  // ~76 minutes

console.log(`Workout duration: ${toHumanTime(workoutDuration, true)}`)
// "Workout duration: 1hr 16min 7sec"
```

#### Different Time Ranges

```typescript
import { toHumanTime } from '@h3ravel/support'

// Seconds only
toHumanTime(45)               // "0:45"
toHumanTime(45, true)         // "45sec"

// Minutes and seconds
toHumanTime(125)              // "2:05"
toHumanTime(125, true)        // "2min 5sec"

// Hours, minutes, and seconds
toHumanTime(4505)             // "1:15:05"
toHumanTime(4505, true)       // "1hr 15min 5sec"

// Multiple hours
toHumanTime(36000)            // "10:00:00"
toHumanTime(36000, true)      // "10hr"
```

#### Edge Cases

```typescript
import { toHumanTime } from '@h3ravel/support'

toHumanTime()                 // "0:00"
toHumanTime(0)                // "0:00"
toHumanTime(0, true)          // "0sec"
toHumanTime(-100)             // "0:00" (negative values treated as 0)
toHumanTime(NaN)              // "0:00"
```

---

## Comparison Table

| Helper | Input | Output Example | Use Case |
|--------|-------|----------------|----------|
| `abbreviate()` | 1234567 | "1.23M" | Large numbers, statistics |
| `humanize()` | 42 | "forty two" | Written numbers, readable IDs |
| `toBytes()` | 1048576 | "1 MiB" | File sizes, storage |
| `toHumanTime()` | 3661 | "1:01:01" | Durations, timers |

---

## Usage Tips

### 1. **Choose the Right Helper**

```typescript
import { abbreviate, toBytes, toHumanTime } from '@h3ravel/support'

// For large counts/stats → abbreviate()
const followers = 1543678
console.log(abbreviate(followers))  // "1.54M"

// For file/data sizes → toBytes()
const fileSize = 5242880
console.log(toBytes(fileSize))      // "5 MiB"

// For time durations → toHumanTime()
const duration = 3725
console.log(toHumanTime(duration))  // "1:02:05"
```

### 2. **Locale-Aware Formatting**

```typescript
import { abbreviate } from '@h3ravel/support'

// Adapt to user's locale
const userLocale = navigator.language || 'en-US'
const count = 1234567

console.log(abbreviate(count, userLocale))
```

### 3. **Consistent Decimal Places**

```typescript
import { toBytes } from '@h3ravel/support'

// Use consistent decimals for better UX
const files = [1024, 2048, 4096]

files.forEach(size => {
  console.log(toBytes(size, 2))  // Always 2 decimal places
})
// Output: "1.00 KiB", "2.00 KiB", "4.00 KiB"
```

### 4. **Dynamic Time Format**

```typescript
import { toHumanTime } from '@h3ravel/support'

// Use worded format for natural language
const duration = 125
console.log(`Video length: ${toHumanTime(duration, true)}`)
// "Video length: 2min 5sec"

// Use digital format for UI elements
console.log(`Duration: ${toHumanTime(duration)}`)
// "Duration: 2:05"
```

### 5. **Error Handling**

```typescript
import { humanize, toBytes, toHumanTime } from '@h3ravel/support'

// humanize() throws on negative numbers
try {
  humanize(-5)
} catch (error) {
  console.error('Invalid input')
}

// Other helpers handle invalid input gracefully
console.log(toBytes(undefined))      // "0 Bytes"
console.log(toHumanTime(NaN))        // "0:00"
```

---

## TypeScript Support

All Number helpers are fully typed and provide excellent TypeScript support:

```typescript
import { 
  abbreviate, 
  humanize, 
  toBytes, 
  toHumanTime 
} from '@h3ravel/support'

// Type inference works automatically
const abbreviated: string = abbreviate(1000000)
const words: string = humanize(42)
const size: string = toBytes(1024)
const time: string = toHumanTime(3600)

// Optional parameters are type-safe
abbreviate(1000, 'en-US')           // Valid
humanize(100, '-')                  // Valid
humanize(100, '/')                  // Type error
toBytes(1024, 2, true)              // Valid
toHumanTime(60, true)               // Valid
```