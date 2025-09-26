<p align="center"><a href="https://h3ravel.toneflix.net" target="_blank"><img src="https://raw.githubusercontent.com/h3ravel/assets/refs/heads/main/logo-full.svg" width="200" alt="H3ravel Logo"></a></p>

H3ravel is a modern TypeScript runtime-agnostic web framework built on top of [H3](https://h3.dev), designed to bring the elegance and developer experience of [Laravel](https://laravel.com) to the JavaScript ecosystem.

## Features

- Laravel-inspired architecture – Service Container, Service Providers, Middleware, Facades
- Clean Routing – Dedicated routes directory with web and api route files
- Controllers with decorators – Class-based controllers like Laravel
- HTTP Kernel – Centralized middleware and request lifecycle handling
- Arquebus ORM – Beautiful, expressive ORM inspired by Laravel's Eloquent, designed for TypeScript applications
- Musket CLI - Our Powerful Artisan-like command-line tool for generating code and running tasks
- Modular Services – Mail, Queue, Cache, Broadcasting support
- Runtime Agnostic – Works seamlessly across Node.js, Bun, and Deno
- Type-safe everything – Fully written in TypeScript

## Why H3ravel?

While modern JavaScript frameworks focus on speed and minimalism, they often lack the developer experience and structure found in PHP’s Laravel. H3ravel aims to fill that gap by providing:

- Laravel’s elegance – Familiar MVC patterns, expressive routing, service providers, and middleware.
- TypeScript-first approach – Strong typing and modern DX out of the box.
- Built on H3 – A lightweight, framework-agnostic HTTP library that’s:
  - Fast – Optimized for speed with minimal overhead.
  - Flexible – Works with any runtime or deployment target.
  - Composable – Lets us build a layered Laravel-like architecture without restrictions.
- Runtime agnosticism – Unlike many Node frameworks, H3ravel runs on Node.js, Bun, or Deno with no extra setup.

This combination delivers the productivity of Laravel while leveraging the modern JavaScript ecosystem and runtime flexibility.

## Project Structure

```
h3ravel/
└── src/
│   └── config/            # Configuration files
│   ├── app/
│   │   ├── http/
│   │   │   ├── controllers/   # Controllers
│   │   │   ├── middleware/    # Middleware
|   |   └── Providers/         # Service Providers
│   ├── resources/
│   │   ├── views/         # Edge view files
│   ├── routes/            # Route definitions
│   │   ├── web.ts         # Web routes
│   │   └── api.ts         # API routes
│   ├── database/          # ORM, migrations, seeds
│   ├── console/           # CLI commands
│   ├── services/          # Mail, Queue, Cache
│   ├── support/           # Helpers, utilities
│   └── index.ts           # Main entry point
├── storage
│   └── app
│       └── public         # default uploads directory
└── public                 # public directory for public assets
```

## Philosophy

- Laravel DX, TypeScript speed – H3ravel brings Laravel’s expressive syntax and architecture to JavaScript with full type safety.
- Minimal, yet scalable – Built on H3’s tiny but powerful HTTP handling, keeping your app fast and maintainable.
- Runtime Freedom – Designed to run on Node.js, Bun, and Deno without code changes.
- Convention over configuration – Opinionated structure for faster development.
- DRY - We take the DRY priciple very seriously and reuse anything and everything we can find in the open, maybe slightly repurposed, but yeah! We do.

## Roadmap

- <icon name="fas fa-square-check" /> Application container with service providers
- <icon name="fas fa-square-check" /> Middleware pipeline and HTTP kernel
- <icon name="fas fa-square-check" /> Routing system
- <icon name="fas fa-square-check" /> Config management and environment handling
- <icon name="fas fa-square" /> Community Building
- <icon name="fas fa-square" /> Musket CLI (artisan-like commands)
- <icon name="fas fa-square" /> Cache Management
- <icon name="fas fa-square" /> Queues, Mail, Events, Broadcasting
- <icon name="fas fa-square" /> Arquebus ORM with relationships (Eloquent-style)
- <icon name="fas fa-square" /> First-class runtime adapters (Node, Bun, Deno)

## Alpha Warning!

This project is currently under development.
There may still be major changes.

If you have any issues or questions or just want to give us feedback, join our [Discord](https://discord.gg/hsG2A8PuGb).

## State of the Docs

This documentation is a work in progress.
We are constantly working on improving it.
If you have any questions or suggestions, feel free to use our [Discord](https://discord.gg/hsG2A8PuGb) or create an issue or improving PR in the Docs repo.

## Security Vulnerabilities

If you discover a security vulnerability within H3ravel, please send an e-mail to Legacy via hamzas.legacy@toneflix.net. All security vulnerabilities will be promptly addressed.

## License

The H3ravel framework is open-sourced software licensed under the MIT license.
