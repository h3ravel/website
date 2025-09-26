# File Storage

## Introduction

H3ravel provides a powerful filesystem abstraction thanks to the wonderful Flydrive package. The H3ravel Flydrive integration provides simple drivers for working with local filesystems, SFTP, and Amazon S3. Even better, it's amazingly simple to switch between these storage options between your local development machine and production server as the API remains the same for each system.

## Configuration

H3ravel's filesystem configuration file is located at `src/config/filesystem.ts`. Within this file, you may configure all of your filesystem "disks". Each disk represents a particular storage driver and storage location. Example configurations for each supported driver are included in the configuration file so you can modify the configuration to reflect your storage preferences and credentials.

The `local` driver interacts with files stored locally on the server running the H3ravel application, while the sftp storage driver is used for SSH key-based FTP. The s3 driver is used to write to Amazon's S3 cloud storage service.

> You may configure as many disks as you like and may even have multiple disks that use the same driver.

## The Public Disk

The `public` disk included in your application's `filesystem` configuration file is intended for files that are going to be publicly accessible. By default, the `public` disk uses the local driver and stores its files in `storage/app/public`.

If your `public` disk uses the `local` driver and you want to make these files accessible from the web, you should create a symbolic link from source directory `storage/app/public` to target directory `public/storage`:

To create the symbolic link, you may use the `storage:link` Musket command:

::: code-group

```sh [npx]
$ npx musket storage:link"
```

```sh [npm]
$ npm musket storage:link"
```

```sh [pnpm]
$ pnpm musket storage:link"
```

```sh [yarn]
$ yarn musket storage:link"
```

```sh [bun]
$ bun musket storage:link"
```

:::

Once a file has been stored and the symbolic link has been created, you can create a URL to the files using the `asset` helper:

```ts
console.log(asset('storage/file.txt'));
```

You may configure additional symbolic links in your `filesystem` configuration file. Each of the configured links will be created when you run the `storage:link` command:

```ts
links: {
    [public_path('storage')]: storage_path('app/public'),
    [public_path('images')]: storage_path('app/images'),
},
```

The `storage:unlink` command may be used to destroy your configured symbolic links:

::: code-group

```sh [npx]
$ npx musket storage:unlink"
```

```sh [npm]
$ npm musket storage:unlink"
```

```sh [pnpm]
$ pnpm musket storage:unlink"
```

```sh [yarn]
$ yarn musket storage:unlink"
```

```sh [bun]
$ bun musket storage:unlink"
```

:::
