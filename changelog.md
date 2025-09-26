# Changelog

All changes and features will be documented here.

## 1.9.0

- refactor: move `musket fire` command to the http package
- refactor: move `musket migrate` command to the database package
- feat: add `list` musket command and move base command to core class.
- feat: create filesystem package
- feat: implement `make:view` command.
- feat: bind the `view` method to the global variable space.

## 1.9.1

feat: improve Musket command and improve Make command structure.
feat: implement make:view command.
feat: bind the view method to the global variable space.
fix: correct model creation bug on MakeCommand
fix: general bug fixes

## 1.9.6

- feat: load all packages version into the app.versions object
- feat: if making files in with defined path, ensure directories get created
- fix: model make command force is an option not an argument
- fix: general bug fixes
- fix: Register globals before loading config files.
- refactor: made console independent of other packages for service provider registration.
- create the storage:link musket command.
- fix: ensure that providers table can display conrrectly.

## 1.10.0

- feat: add build command, fix bugs and update package versions.
- feat: add a spawn script to quickly build the project and ensure consistency.

## 1.11.0

- feat: allow the getPakageInstallCommand to also check general installs.
- feat: add postinstall to script
