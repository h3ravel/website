# Debug Helpers

The `@h3ravel/support` package provides convenient debugging helpers inspired by Laravel's debugging utilities. These helpers make it easy to inspect variables, objects, and data structures during development.

## Available Helpers

- [`dump()`](#dump) - Output values and continue execution
- [`dd()`](#dd) - Output values and terminate execution

---

## `dump()`

Dumps one or more values to the console with detailed inspection and continues program execution. This is useful when you want to inspect values without stopping your application.

### Signature

```typescript
dump(...args: unknown[]): void
```

### Parameters

- `...args` - One or more values of any type to inspect

### Returns

`void` - Returns nothing, simply outputs to console

### Behavior

- Outputs detailed inspection of each argument
- Shows hidden properties
- Displays full object depth (no truncation)
- Uses colored output for better readability
- **Continues execution** after dumping

### Examples

#### Basic Usage

```typescript
import { dump } from '@h3ravel/support'

const user = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
}

dump(user)
// Outputs the user object and continues execution
console.log('Program continues...')
```

#### Dumping Multiple Values

```typescript
import { dump } from '@h3ravel/support'

const name = 'Alice'
const age = 25
const hobbies = ['reading', 'coding', 'gaming']

dump(name, age, hobbies)
// Outputs all three values in order
```

#### Debugging in Functions

```typescript
import { dump } from '@h3ravel/support'

function processOrder(order: any) {
  dump(order) // Inspect the order
  
  // Continue processing...
  const total = order.items.reduce((sum, item) => sum + item.price, 0)
  
  dump(total) // Inspect the calculated total
  
  return total
}
```

#### Inspecting Complex Objects

```typescript
import { dump } from '@h3ravel/support'

const complexData = {
  user: {
    profile: {
      settings: {
        theme: 'dark',
        notifications: true
      }
    }
  },
  metadata: new Map([['key1', 'value1']]),
  created: new Date()
}

dump(complexData)
// Shows complete nested structure with all details
```

---

## `dd()`

Dumps one or more values to the console with detailed inspection and then **terminates the program**. This is Laravel's famous "Dump and Die" function, perfect for debugging when you want to inspect a value and stop execution immediately.

### Signature

```typescript
dd(...args: unknown[]): never
```

### Parameters

- `...args` - One or more values of any type to inspect

### Returns

`never` - This function never returns; it terminates the process with exit code 1

### Behavior

- Outputs detailed inspection of each argument
- Shows hidden properties
- Displays full object depth (no truncation)
- Uses colored output for better readability
- **Terminates the process** after dumping (exit code 1)

### Examples

#### Basic Usage

```typescript
import { dd } from '@h3ravel/support'

const user = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
}

dd(user)
// Outputs the user object and STOPS execution
console.log('This line will NEVER execute')
```

#### Quick Debugging in Middleware

```typescript
import { dd } from '@h3ravel/support'

function authenticate(request: any) {
  const token = request.headers.authorization
  
  dd(token) // Inspect token and stop here
  
  // Nothing below this line will execute
  return validateToken(token)
}
```

#### Debugging API Responses

```typescript
import { dd } from '@h3ravel/support'

async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`)
  const data = await response.json()
  
  dd(data) // Inspect the response and stop
  
  return data // This will never be reached
}
```

#### Inspecting Multiple Values Before Exit

```typescript
import { dd } from '@h3ravel/support'

function calculateTotal(items: any[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax
  
  dd(subtotal, tax, total) // Inspect all values and stop
}
```

---

## Comparison: `dump()` vs `dd()`

| Feature | `dump()` | `dd()` |
|---------|----------|--------|
| Output to console | ✅ Yes | ✅ Yes |
| Detailed inspection | ✅ Yes | ✅ Yes |
| Shows hidden properties | ✅ Yes | ✅ Yes |
| Colored output | ✅ Yes | ✅ Yes |
| Continues execution | ✅ Yes | ❌ No |
| Terminates process | ❌ No | ✅ Yes (exit code 1) |
| Use case | Debug without stopping | Debug and stop immediately |

---

## When to Use Each Helper

### Use `dump()` when:
- You want to inspect values at multiple points in your code
- You need your application to continue running
- You're debugging in a loop or recurring process
- You want to trace the flow of data through your application

### Use `dd()` when:
- You want to inspect a value and stop execution immediately
- You're debugging an issue and don't need code after that point to run
- You want to prevent side effects from occurring after a certain point
- You're doing quick debugging and want immediate feedback

---

## Tips

1. **Remove before production**: Both helpers are meant for development. Remove them before deploying to production.

2. **Multiple values**: Both functions accept multiple arguments, which is useful for comparing values:
   ```typescript
   dd(expected, actual, difference)
   ```

3. **Deep inspection**: Unlike `console.log()`, these helpers show the complete structure of objects without truncation.

4. **TypeScript support**: Both functions are fully typed and work seamlessly with TypeScript.

5. **Chaining**: Since `dump()` returns `void`, you can't chain it, but you can use it inline:
   ```typescript
   const result = someFunction()
   dump(result)
   return result
   ```

---

## Implementation Details

Both helpers use Node.js's `util.inspect()` with the following options:
- `showHidden: true` - Shows non-enumerable properties
- `depth: null` - No depth limit (shows complete structure)
- `colors: true` - Colored output for better readability

The output is sent to `console.log()` for each argument, and `dd()` calls `process.exit(1)` after dumping.