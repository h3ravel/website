# Changelog

All changes and features will be documented here.

## H3ravel Framework - 1.29.0-alpha-17

Released June 12, 2026.

### Testing

- Added a framework testing wrapper backed by Parasito for fluent HTTP assertions.
- Added application bootstrapping helpers for tests, including request clients and normalized response handling.
- Added route-level integration tests against the basic application without modifying its application routes.
- Improved router test isolation and corrected route registration behavior required by the testing client.

### Development Runtime

- Added the shared `importFile()` utility with Jiti-powered TypeScript transpilation, TypeScript path support, conventional application aliases, and native-first dependency loading.
- Replaced development-time `import()` and `createRequire()` usage across configuration, provider discovery, console bootstrapping, migrations, seeders, hashing, routing, and testing.
- Development commands can now load application TypeScript directly without first replacing source paths with `DIST_DIR`; production continues to load compiled JavaScript artifacts.
- JavaScript artifacts use their native module graph to preserve constructor identity across dynamic imports.
- Dropped CommonJS support across H3ravel packages. Builds, package exports, development artifacts, and runtime entry points are now ESM-only; consumers must use `import` instead of `require()`.

### Container And Contracts

- Added canonical process-wide container tokens for framework contracts using `Symbol.for()`.
- Normalized container bindings, aliases, resolution callbacks, extenders, and instances against canonical contract tokens.
- Prevented duplicated contract constructors from Jiti, ESM/CJS boundaries, workspace links, or multiple package copies from losing their service bindings.
- Preserved constructor identity for concrete implementations and added regression coverage for duplicated contract modules.

### Console And Builds

- Removed the global `tsx/esm` loader from the Musket executable; application TypeScript is now loaded through `importFile()`.
- Replaced package development entry-point runners with `tsdown --watch`.
- Removed unused package-level `tsx` and `cross-env` dependencies and retired stale development scripts.
- Switched application-facing tsdown commands to the native config loader, fixing basic-app postinstall resolution from temporary unrun cache directories.
- Fixed basic-app postinstall generation of `.h3ravel/serve`, including server, bootstrap, routes, configuration, resources, and public assets.
- Added container and module-loading contribution rules covering canonical tokens, native imports, and required regression tests.

### Reliability

- Added module identity tests proving JavaScript imports reuse the native module cache.
- Added container tests for equivalent contract constructors and concrete subclass isolation.
- Verified the basic application HTTP suite independently to prevent test-order masking.

## H3ravel Framework - 1.29.0-alpha-16

Released June 12, 2026.

### Filesystem

- Rebuilt filesystem storage around Flydrive with a unified `FilesystemManager`.
- Added local, public, S3, FTP/SFTP, Google Cloud Storage, and custom driver support.
- Added the `Storage` facade, disk switching, file metadata, visibility, streaming, signed URL, upload, copy, move, and deletion APIs.
- Added GCS configuration types and support for either client options or an injected Google Storage client.
- Removed the filesystem manager's application constructor dependency and aligned all Flydrive driver type versions.
- Renamed the previous `Storage` implementation and contract to `FilesystemManager` and `IFilesystemManager`.
- Fixed public path resolution and normalized local filesystem driver paths.
- Added deterministic filesystem, storage, FTP, and GCS tests.

### Database

- Added native support for SQLite's `:memory:` database configuration without resolving it through `database_path()`.
- Updated database-backed session and validation tests to use in-memory SQLite instead of requiring MySQL.

### Core And HTTP

- Fixed request lifecycle isolation so response bindings resolve the current request's response.
- Prevented redirect status and headers from leaking into subsequent requests.
- Added request lifecycle regression coverage for response rebinding.
- Updated application bootstrapping, provider setup, and HTTP test fixtures to match the current framework lifecycle.

### URL And Routing

- Updated action URL generation to support the current router collection while retaining legacy route compatibility.
- Updated route tests and provider imports for the current routing architecture.
- Fixed public asset path resolution.

### Testing

- Audited and repaired the framework test suites after the architecture overhaul.
- Replaced disabled FTP checks with deterministic mocked tests.
- Updated hashing configuration tests to work from temporary directories without unresolved workspace imports.
- Corrected mixin and trait constructor assertions and improved test isolation.
- Added testing application helpers and refreshed package test configuration.

### Releases And Tooling

- Added a custom synchronized package versioning system with `major`, `minor`, `patch`, and alpha release support.
- Added versioning tests for package lanes, staged major catch-up, shared alpha counters, and workspace dependency ranges.
- Updated package build, TypeScript, barrel, lint, and workspace configuration.
- Added missing runtime dependencies and refreshed package dependency ranges.
- Updated GitHub Actions versions and Codecov to v7.
- Added explicit SQLite native binding rebuild and verification steps to test, review, and release workflows.
- Updated mail dependencies to address the reported `fast-xml-parser` vulnerability.

### Queue

- Explored a BullMQ queue driver and queue manager implementation.
- Reverted the experimental BullMQ integration before release; it is not included in `1.29.0-alpha-16`.

## @h3ravel/core - 1.16.2

- fix(core): assign default verbose flag value

## @h3ravel/core - 1.16.1

- feat(core): allow musket verbose generic option to support v and vv as value so we can do -vvv

## @h3ravel/console - 11.9.1

- feat(core): add v and vv as allowed values verbose flag so we can do -vvv

## @h3ravel/cache - 11.0.7

- feat(cache): support service provider auto registration.

## @h3ravel/config - 1.4.5

- feat(config): support service provider auto registration.

## @h3ravel/filesystem - 0.4.3

- feat(filesystem): support service provider auto registration.

## @h3ravel/mail - 11.0.7

- feat(mail): support service provider auto registration.

## @h3ravel/queue - 11.0.4

- feat(queue): support service provider auto registration.

## @h3ravel/router - 1.11.2

- feat(router): support service provider auto registration.

## @h3ravel/url - 1.0.2

- feat(url): support service provider auto registration.

## @h3ravel/view - 0.1.3

- feat(view): support service provider auto registration.

## @h3ravel/database - 11.4.0

- feat(database): force option to migrate command.
- feat(database): support running seeders from applicable migration command.
- feat(database): support service provider auto registration.

## @h3ravel/console - 11.9.0

- feat(console): add fail method to the base musket class
- feat(console): add support for service container resolution in Musket command handler.
- feat(console): support choices definition for command options in signature.

## @h3ravel/core - 1.16.0

- feat(core): add withCommands to Application core to allow early service provider registration.
- refactor(core): depracate base ServiceProvider commands method replacinf with a registerCommands methods

## @h3ravel/hashing - 0.1.3

- feat(hashing): support HASH_VERIFY env var when config is not available.
- feat(hashing): support HASH_DRIVER env var when config is not available.

## @h3ravel/hashing - 0.1.1 - 0.1.2

- feat(hashing): support `HASH_VERIFY` env var when config is not available.
- feat(hashing): support `HASH_DRIVER` env var when config is not available.
- update(hashing): add `@h3ravel/core` to `peerDependencies` but keep it optional.

## @h3ravel/support - 0.14.0

- feat: mirror `Arr` helpers with Laravel's
- feat: extend `Arr` and `Obj` helpers.

## @h3ravel/core - 1.15.0

- feat: initialize support for service provider auto discovery
- feat: add support for service provider auto registration.
- feat: add support for thirdparty package service provider auto discovery.
- faet: provide access to the Application instance within singleton callback

## @h3ravel/hashing - 0.1.0

- create hashing package
- complete password hashing feature

## @h3ravel/console - 11.8.0

- fix: fix debug log bugs
- feat: ensure all general flags work as expected.
- feat: add support for musket command interactive state manipulation.
- faet: add runtime exception
- feat: add ConfgPublishCommand

## @h3ravel/console - 11.7.1

- feat: add logging methods to musket commands
- feat: add `info`, `warn`, `line`, `newLine`, `success`, `error`, `debug` methods
- feat: integrate logger utility from `@h3ravel/shared`
- feat: add comprehensive unit tests for all logging methods
- feat: ensure all logging uses centralized logger

## @h3ravel/http - 11.3.2

- feat(http): add `Url` class binding to service container
- Create `Url` class with URL generation functionality
- Bind `Url` to container as `'app.url'` in `HttpServiceProvider`
- Add global `url()` helper that resolves via container
- Support both `url()` (returns instance) and `url(path)` (returns string)
- Add TypeScript definitions for global `url()` function

## @h3ravel/url - 1.0.0

- feat: create request-aware URI builder for H3ravel framework

## @h3ravel/arquebus - 0.6.6

- refactor: update `twoColumnLog` method to `twoColumnDetail`

## @h3ravel/arquebus - 0.6.5

- refactor: replace most built in handlers from equivalents from `@h3ravel/shared`

## @h3ravel/database - 11.3.0

- feat: implement `make:seeder` musket command.
- feat(database): add `db:seed` Musket command and support for database seeding
- feat(database): create new `DB` class
- fix(database): general bug fixes

## @h3ravel/console - 11.7.0

- fix(console): properly handle optional command signature
- fix(console): general bug fixes

## @h3ravel/core - 1.13.0

- feat(core): service container can now infer anything passed to it
- fix(core): general bug fixes

## @h3ravel/router - 1.11.0

- fix(router): general bug fixes

## @h3ravel/shared - 0.21.0

- refactor(shared): improve the `resolveFileUp` filesystem method
- refactor(shared): rename `twoColumnLog` filesystem method to `twoColumnDetail`
- refactor(shared): add `advancedTaskRunner` TaskManager method

## @h3ravel/support - 0.13.0

- feat(support): add `wrap` `Arr` method

## @h3ravel/arquebus - 0.6.0

- Fixed linting errors by @AbiodunVlad in #5
- feat(arquebus, seeders, inspector): Introduce database seeding support to Arquebus ORM by @Cedarich - in #6
- fix: improve model typing d1e65fb
- fix: fix all compose issues 05d08ef

## @h3ravel/view - 0.1.0

- feat: extract view system into separate @h3ravel/view package

## @h3ravel/core - v1.12.0

- feat: move all view logic out of core.

## @h3ravel/support - v0.11.0

- feat: implement common helpers library

## @h3ravel/router - v1.10.0

- feat: add route:list musket command

## @h3ravel/console - v11.6.1

- update: remove unnecesary assertions

## @h3ravel/database - v11.2.7

- update: remove unnecesary assertions

## @h3ravel/filesystem - v0.4.0

- feat: add storage:unlink command.

## v1.11.0

- feat: allow the getPakageInstallCommand to also check general installs.
- feat: add postinstall to script

## v1.10.0

- feat: add build command, fix bugs and update package versions.
- feat: add a spawn script to quickly build the project and ensure consistency.

## v1.9.6

- feat: load all packages version into the app.versions object
- feat: if making files in with defined path, ensure directories get created
- fix: model make command force is an option not an argument
- fix: general bug fixes
- fix: Register globals before loading config files.
- refactor: made console independent of other packages for service provider registration.
- create the storage:link musket command.
- fix: ensure that providers table can display conrrectly.

## v1.9.1

- feat: improve Musket command and improve Make command structure.
- feat: implement make:view command.
- feat: bind the view method to the global variable space.
- fix: correct model creation bug on MakeCommand
- fix: general bug fixes

## v1.9.0

- refactor: move `musket fire` command to the http package
- refactor: move `musket migrate` command to the database package
- feat: add `list` musket command and move base command to core class.
- feat: create filesystem package
- feat: implement `make:view` command.
- feat: bind the `view` method to the global variable space.
