# Changelog

All changes and features will be documented here.

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
