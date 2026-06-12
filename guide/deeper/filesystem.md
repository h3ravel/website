# File Storage

## Introduction

H3ravel provides a unified filesystem API powered by [Flydrive](https://github.com/flydrive-js/core). The same `FilesystemManager` methods work across local storage, FTP, Amazon S3, Google Cloud Storage, and custom drivers.

Filesystems are configured as named **disks**. You may configure multiple disks, switch between them at runtime, and use several disks backed by the same driver.

## Configuration

The filesystem configuration file is located at `src/config/filesystem.ts`.

```ts
import type { FilesystemConfig } from '@h3ravel/foundation'

export default (): FilesystemConfig => ({
  default: env('FILESYSTEM_DISK', 'public'),

  disks: {
    local: {
      driver: 'local',
      root: storage_path('app'),
      visibility: 'private',
    },

    public: {
      driver: 'local',
      root: storage_path('app/public'),
      url: `${env('APP_URL')}/storage`,
      visibility: 'public',
    },

    ftp: {
      driver: 'ftp',
      host: env('FTP_HOST'),
      username: env('FTP_USERNAME'),
      password: env('FTP_PASSWORD'),
      port: env('FTP_PORT', 21),
      privateKey: env('FTP_PRIVATE_KEY'),
    },

    s3: {
      driver: 's3',
      key: env('AWS_ACCESS_KEY_ID'),
      secret: env('AWS_SECRET_ACCESS_KEY'),
      region: env('AWS_DEFAULT_REGION'),
      bucket: env('AWS_BUCKET'),
      url: env('AWS_URL'),
      endpoint: env('AWS_ENDPOINT'),
      visibility: 'private',
    },

    gcs: {
      driver: 'gcs',
      projectId: env('GOOGLE_CLOUD_PROJECT'),
      keyFilename: env('GOOGLE_APPLICATION_CREDENTIALS'),
      bucket: env('GOOGLE_CLOUD_STORAGE_BUCKET'),
      visibility: 'private',
      usingUniformAcl: true,
    },
  },

  links: {
    [public_path('storage')]: storage_path('app/public'),
  },
})
```

The built-in drivers are:

- `local`: Files stored on the application server.
- `ftp`: FTP storage using password or private-key authentication.
- `s3`: Amazon S3 and S3-compatible services.
- `gcs`: Google Cloud Storage.

## Accessing Storage

Use the `Storage` facade for the default disk:

```ts
import { Storage } from '@h3ravel/filesystem/facades'

await Storage.put('reports/summary.txt', 'Ready')
```

Select another configured disk with `disk`:

```ts
await Storage.disk('s3').put('reports/summary.txt', 'Ready')

console.log(Storage.getDiskName())   // s3
console.log(Storage.getDriverName()) // s3
```

`disk` returns the manager instance, so calls may be chained.

## File Operations

### Writing Files

```ts
await Storage.put('documents/notes.txt', 'Hello H3ravel')
await Storage.put('documents/data.bin', new Uint8Array([1, 2, 3]))
```

Uploaded file-like objects containing a `buffer` may also be stored:

```ts
await Storage.put('avatars/user.png', uploadedFile)
```

### Reading Files

```ts
const contents = await Storage.get('documents/notes.txt')
const bytes = await Storage.getBytes('documents/data.bin')
const stream = await Storage.getStream('documents/large.txt')
```

### Checking Files

```ts
if (await Storage.exists('documents/notes.txt')) {
  console.log('The file exists')
}
```

### Copying And Moving

```ts
await Storage.copy('documents/notes.txt', 'documents/notes-copy.txt')
await Storage.move('documents/notes-copy.txt', 'archive/notes.txt')
```

Source and destination paths are keys relative to the selected disk root.

### Deleting Files

```ts
await Storage.delete('documents/notes.txt')
await Storage.deleteAll('archive')
```

Deleting a missing file does not throw an error.

## URLs And Visibility

```ts
const url = await Storage.getUrl('avatars/user.png')
const temporaryUrl = await Storage.getSignedUrl('private/report.pdf', {
  expiresIn: '30 mins',
})

await Storage.setVisibility('avatars/user.png', 'public')
const visibility = await Storage.getVisibility('avatars/user.png')
```

URL and visibility support depends on the selected driver. Local disk URLs use the disk's `url` option when configured, otherwise they use `app.url`.

## File Metadata

```ts
const metadata = await Storage.getMetaData('documents/notes.txt')

console.log(metadata.contentType)
console.log(metadata.contentLength)
console.log(metadata.lastModified)
```

## Saving Uploaded Files

`saveFile` generates a filename, stores the file, and returns its URL and stored path:

```ts
const [url, storedPath] = await Storage
  .disk('public')
  .saveFile(uploadedFile, 'avatars')
```

Pass a third argument to use a specific filename:

```ts
const [url, storedPath] = await Storage.saveFile(
  uploadedFile,
  'avatars',
  'profile.png',
)
```

You may customize generated filenames:

```ts
fileNameGenerator: (originalName: string) => {
  return `${crypto.randomUUID()}-${originalName}`
},
```

## Google Cloud Storage

The GCS driver accepts the standard Google Cloud Storage client options shown above. You may also provide an initialized `@google-cloud/storage` client:

```ts
import { Storage as GoogleStorage } from '@google-cloud/storage'

const googleStorage = new GoogleStorage({
  projectId: env('GOOGLE_CLOUD_PROJECT'),
  keyFilename: env('GOOGLE_APPLICATION_CREDENTIALS'),
})

export default () => ({
  default: 'gcs',
  disks: {
    gcs: {
      driver: 'gcs',
      storage: googleStorage,
      bucket: env('GOOGLE_CLOUD_STORAGE_BUCKET'),
      visibility: 'private',
      usingUniformAcl: true,
    },
  },
  links: {},
})
```

## The Public Disk

The default `public` disk stores files in `storage/app/public`. To expose these files, create the configured symbolic links:

::: code-group

```sh [npx]
npx musket storage:link
```

```sh [npm]
npm exec musket storage:link
```

```sh [pnpm]
pnpm musket storage:link
```

```sh [yarn]
yarn musket storage:link
```

```sh [bun]
bunx musket storage:link
```

:::

Use `--force` to recreate existing links:

```sh
pnpm musket storage:link --force
```

Remove configured links with:

```sh
pnpm musket storage:unlink
```

After creating the link, files may be referenced with the `asset` helper:

```ts
console.log(asset('storage/file.txt'))
```

Configure additional links in the `links` object:

```ts
links: {
  [public_path('storage')]: storage_path('app/public'),
  [public_path('images')]: storage_path('app/images'),
},
```

## Custom Drivers

Custom drivers implement Flydrive's `DriverContract` and are registered in `custom_drivers`:

```ts
import type { DriverContract } from 'flydrive/types'

class MemoryDriver implements DriverContract {
  // Implement the Flydrive driver contract.
}

export default () => ({
  default: 'memory',
  disks: {
    memory: {
      driver: 'memory',
    },
  },
  custom_drivers: {
    memory: MemoryDriver,
  },
  links: {},
})
```

The custom disk is accessed through the same API:

```ts
await Storage.disk('memory').put('example.txt', 'Stored in memory')
```

For type-safe custom disk configuration, augment `CustomDiskDriverRegistry`:

```ts
declare module '@h3ravel/foundation' {
  interface CustomDiskDriverRegistry {
    memory: {
      driver: 'memory'
    }
  }
}
```
