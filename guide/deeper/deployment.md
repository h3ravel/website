# Deploying H3ravel Applications with Musket

Musket’s `build` command prepares your H3ravel application for deployment. It compiles TypeScript, bundles dependencies, optimizes your code, and produces a clean, production-ready output.

> **Tip:** Use the `--minify` flag for production builds to reduce bundle size and improve performance.

## Usage

```bash
# Basic production build
npx musket build

# Build with minification
npx musket build --minify

# Build with detailed logs
npx musket build --verbose

# Silent build (no output)
npx musket build --quiet
```

## Command Options

| Option      | Shortcut | Description                          |
| ----------- | -------- | ------------------------------------ |
| `--minify`  | `-m`     | Minify output for smaller file sizes |
| `--verbose` | `-v`     | Enable detailed build output         |
| `--quiet`   | `-q`     | Suppress all output messages         |
| `--silent`  | —        | Alias for `--quiet`                  |

## What the Build Command Does

The Musket build process performs several key operations:

1. **Compiles TypeScript** – Transpiles `.ts` files into JavaScript
2. **Bundles Dependencies** – Uses `tsdown` to generate optimized output
3. **Copies Assets** – Moves public, view, and database assets to `dist/`
4. **Cleans Old Builds** – Removes outdated artifacts before rebuilding
5. **Optimizes Output** – Minifies and compresses when `--minify` is used
6. **Sets Environment Flags** – Ensures correct production runtime settings

> **Note:** Musket automatically detects your package manager (pnpm, npm, yarn) and adjusts the build process accordingly.

---

## Output Directory

By default, builds are generated in the `dist/` directory:

```
dist/
├── app/
├── bootstrap/
├── config/
├── public/
├── resources/
├── routes/
└── server.js
```

### Custom Output Directory

You can override the output path using the `DIST_DIR` environment variable:

```bash
# Custom directory
DIST_DIR=build npx musket build

# Versioned release directory
DIST_DIR=releases/v1.0.0 npx musket build
```

## Deployment Targets

Musket integrates smoothly into multiple deployment environments.

### CI/CD Pipelines

> **Use case:** Automated deployments, continuous delivery, and reproducible builds.

#### GitHub Actions

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      - name: Install dependencies
        run: npm ci
      - name: Build application
        run: npx musket build --minify --quiet
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

#### GitLab CI

```yaml
build:
  stage: build
  image: node:22
  script:
    - npm ci
    - npx musket build --minify --quiet
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
```

> **Tip:** Use `--quiet` in CI builds to suppress logs and keep output clean.

### Containerized Deployments

> **Use case:** Consistent, portable builds across environments.

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx musket build --minify

FROM node:22-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

> **Note:** Musket automatically ensures that database migration, factory, and seeder files are excluded from production builds.

## Running the Production Build

Once built, you can start your app directly from the compiled bundle:

```bash
# Standard start
node dist/server.js

# Explicitly set environment
NODE_ENV=production node dist/server.js

# Or via package.json
npm start
```

**Example `package.json`:**

```json
{
  "scripts": {
    "build": "npx musket build",
    "build:prod": "npx musket build --minify",
    "start": "node dist/server.js"
  }
}
```

## Troubleshooting

### Build Fails with TypeScript Errors

```bash
# Validate TypeScript setup
npx tsc --noEmit

# Fix issues before re-running build
npx musket build
```

### Out of Memory

```bash
NODE_OPTIONS="--max-old-space-size=4096" npx musket build
```

### Missing Dependencies

```bash
npm ci
rm -rf dist
npx musket build
```

### Slow Builds

```bash
# Skip minification during development
npx musket build

# Diagnose with verbose logs
npx musket build --verbose
```

### Permission Errors

```bash
chmod -R 755 dist/
DIST_DIR=~/builds/app npx musket build
```

> **Tip:** Ensure your CI/CD environment grants write access to the `DIST_DIR`.

## Best Practices

### 1. Clean Builds

```bash
rm -rf dist/
npx musket build --minify
```

> Keeps production artifacts consistent and reduces build drift.

### 2. Ignore Build Artifacts

```gitignore
dist/
build/
.h3ravel/
.env.local
.env.production
```

> Avoid committing build outputs or environment files.

### 3. Environment-Specific Builds

```bash
# Development
NODE_ENV=development npx musket build

# Production
NODE_ENV=production npx musket build --minify

# Staging
NODE_ENV=staging DIST_DIR=dist-staging npx musket build
```

### 4. Validate Builds Before Deployment

```bash
npx musket build --minify
node dist/server.js
npm run test:smoke
```

> Always test your compiled output before deployment.

### 5. Pre- and Post-Build Hooks

```json
{
  "scripts": {
    "prebuild": "npm run lint && npm run test",
    "build": "npx musket build --minify",
    "postbuild": "npm run validate"
  }
}
```

> Automate quality checks to prevent bad deployments.

## Performance Optimization

### Build Speed

- Skip minification during development.
- Use incremental builds where possible.
- Keep `tsdown` configuration minimal.

### Bundle Size

```bash
npx musket build --minify
du -sh dist/
find dist/ -type f -size +1M
```

> **Tip:** Regularly audit your dependencies — unused packages increase bundle size.

### Conclusion

The `musket build` command is the final step before deployment in any H3ravel project. It compiles, optimizes, and prepares your application for reliable and repeatable production deployment — whether in CI, Docker, or traditional server environments.
