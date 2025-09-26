# Changelog

All changes and features will be documented here.

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

feat: improve Musket command and improve Make command structure.
feat: implement make:view command.
feat: bind the view method to the global variable space.
fix: correct model creation bug on MakeCommand
fix: general bug fixes

## v1.9.0

- refactor: move `musket fire` command to the http package
- refactor: move `musket migrate` command to the database package
- feat: add `list` musket command and move base command to core class.
- feat: create filesystem package
- feat: implement `make:view` command.
- feat: bind the `view` method to the global variable space.
