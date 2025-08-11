# Mail

## Introduction

H3ravel simplifies email sending with a simple, user-friendly yet powerful and flexible API powered by [Node Mailer](https://nodemailer.com/). H3ravel and Node Mailer offers drivers for SMTP, Amazon SES, and sendmail, enabling quick setup for sending emails via your preferred local or cloud-based service.
It supports templating with Edge views, attachments, and custom mailables, inspired by Laravel’s mail API for familiarity and ease.

## Installation & Setup

To begin sending mails, make sure the `@h3ravel/mail` package has been installed and the `MailServiceProvider` is registered in your application’s service providers.

::: code-group

```sh [npm]
npm install @h3ravel/mail
```

```sh [pnpm]
pnpm install @h3ravel/mail
```

```sh [yarn]
yarn add @h3ravel/mail
```

```sh [bun]
bun install @h3ravel/mail
```

:::

```ts
import { Application } from '@h3ravel/core';
import { IServiceProvider } from '@h3ravel/shared';
import { MailServiceProvider } from '@h3ravel/mail';

export default <Array<new (_app: Application) => IServiceProvider>>[
  //... Other service providers
  MailServiceProvider,
  //... Other service providers
];
```

This binds the Mailer service to the IoC container and loads all mail drivers.

## Configuration

H3ravel's email services are configured via the `src/config/mail.ts` file. Each `mailer` in this file can have unique settings and its own unique "transport", enabling your app to use different email services for different messages. For instance, Postmark for transactional emails and Amazon SES for bulk emails.

The `mailers` array includes sample configurations for supported drivers/transports, with the `default` setting specifying the primary mailer for sending emails.

## Driver / Transport Prerequisites

The API based drivers such as `Mailgun, Postmark, and MailerSend (coming soon)` are often simpler and faster than sending mail via SMTP servers. Whenever possible, we recommend that you use one of these drivers.

### SES Driver

To use the Amazon SES driver set the default option in your `src/config/mail.ts` configuration file to `ses` and verify that your `src/config/services.ts` configuration file contains the following options:

```ts
ses: {
    key: env('AWS_ACCESS_KEY_ID'),
    secret: env('AWS_SECRET_ACCESS_KEY'),
    region: env('AWS_DEFAULT_REGION', 'us-east-1'),
}
```

To utilize AWS [temporary credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html) via a session token, you may add a `token` key to your application's SES configuration:

```ts
ses: {
    key: env('AWS_ACCESS_KEY_ID'),
    secret: env('AWS_SECRET_ACCESS_KEY'),
    region: env('AWS_DEFAULT_REGION', 'us-east-1'),
    token: env('AWS_SESSION_TOKEN'),
}
```

## Mailables

When building H3ravel applications, each type of email sent by your application is represented as a "mailable" class. These classes should be stored in the `src/app/Mail` directory.

> To Be Continued
