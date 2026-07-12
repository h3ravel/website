# TypeScript Support

Arquebus ORM is a TypeScript rewrite, and as of `3.x` it offers real, opt-in type safety. You can describe a model's attributes, relations and table name once and have the model instance, its query builder and its serialized output all become type-aware, while still keeping the loose, dynamic APIs available whenever you want them. Typing is progressive: adopt it where it helps and stay untyped everywhere else.

## Basic Usage (Untyped)

The classic form still works exactly as before. Declaring property types with `declare` gives you editor completion without changing runtime behaviour:

```typescript
import { Model } from '@h3ravel/arquebus';

// Define a basic model
class User extends Model {
  // Optional: declare model property types
  declare id: number;
  declare name: string;
  declare email: string;
}

// Using the model
const user = new User();
user.name = 'John';
await user.save();

// Query example
const users = await User.query().where('age', '>', 18).get();

// Relationship example
class Post extends Model {
  declare title: string;
  declare content: string;
  declare user_id: number;

  relationUser() {
    return this.belongsTo(User);
  }
}
```

## Fully Typed Models

For end-to-end type safety, define your model with `Model.define<Attributes, Relations, Table>()`. The attribute interface flows through the constructor, the accessors (`getAttribute`, `setAttribute`, `fill`, `update`, `toData`) and the query builder:

```typescript
import { Model, arquebus, type Collection } from '@h3ravel/arquebus';

interface PostAttributes {
  id: number;
  title: string;
  published: boolean;
}

class Post extends Model.define<PostAttributes, {}, 'posts'>() {}

interface UserAttributes {
  id: number;
  email: string;
  age: number | null;
  active: boolean;
}

interface UserRelations {
  posts: Collection<Post>;
}

class User extends Model.define<UserAttributes, UserRelations, 'users'>() {
  relationPosts() {
    return this.hasMany(Post);
  }
}

const user = new User({ id: 1, email: 'ada@example.com', age: null, active: true });

user.email;                       // string
user.setAttribute('email', 'grace@example.com');
user.fill({ age: 37 });
const data = user.toData();       // UserAttributes & Partial<UserRelations>

// Model.query() returns a typed ModelBuilder
await User.query()
  .where('email', 'ada@example.com')
  .where('age', '>=', 18)
  .whereIn('id', [1, 2, 3])
  .with('posts')
  .get(); // Promise<Collection<User>>
```

The compiler now rejects mistakes that used to slip through at runtime:

```typescript
new User({ email: 42 });                 // ❌ wrong attribute type
user.setAttribute('age', 'old');         // ❌ wrong value type
User.query().where('missing', 'value');  // ❌ unknown column
User.query().where('active', 'yes');     // ❌ wrong value type
User.query().with('comments');           // ❌ unknown relation
```

### Typed Raw Queries

The raw/table query builder can be typed the same way via `arquebus.withSchema<Database>()`. See the [query builder guide](./query-builder#typed-queries) for the full example:

```typescript
interface Database {
  users: UserAttributes;
  posts: PostAttributes;
}

const db = arquebus.withSchema<Database>();

const rows = await db.table('users').where('active', true).get(); // UserAttributes[]
db.table('posts').insert({ title: 'Typed ORM', published: true });
```

## Enhancing Type Safety with Generics

Whether or not you use `Model.define()`, Arquebus ORM's query methods also accept a generic type argument. This is handy for shaping one-off results (computed columns, raw aggregates or eager-loaded relations) without adding them to the model's attribute interface:

1. Extend model type definitions
2. Specify relationship data types
3. Add custom field types

For example:

```typescript
// Basic query with generics
const user = await User.query().first<
  User & {
    computed_field: string;
  }
>();

// Relationship query with generics
const post = await Post.query().with('user').first<
  Post & {
    user: User;
  }
>();

// Custom query result type
interface CustomUserResult extends User {
  total_posts: number;
  latest_login: Date;
}

const result = await User.query()
  .select(['*'])
  .selectRaw('COUNT(posts.id) as total_posts')
  .first<CustomUserResult>();

// Complex relationship query types
const userWithPosts = await User.query().with('posts').first<
  CustomUserResult & {
    posts: Post[];
  }
>();
```

## Why This Design?

Our design philosophy is:

1. **Prioritize Developer Experience**: The API stays simple and intuitive; full typing is available through `Model.define()` when you want it, never mandatory
2. **Practicality First**: In some scenarios you may prefer the looser, dynamic APIs for flexibility, and you can
3. **Progressive Type Support**: You can gradually add more type definitions as needed, from `declare` fields to fully typed models and schemas

## Best Practices

Despite our approach, we still recommend:

1. Declaring types for main model properties
2. Adding type annotations to critical business logic code
3. Using type assertions or custom type guards where type safety is needed

```typescript
// Declare types for important model properties
class Product extends Model {
  declare id: number;
  declare name: string;
  declare price: number;
  declare stock: number;

  // Use explicit types for custom methods
  async updateStock(quantity: number): Promise<void> {
    this.stock += quantity;
    await this.save();
  }
}
```
