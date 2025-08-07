# Contribution Guide

This guide serves to facilitate effective collaboration within the H3ravel ecosystem. By following these conventions, we ensure the codebase stays clear and organized, streamlining reviews and development for all contributors.

## Community

- [Join the conversation](https://github.com/orgs/h3ravel/discussions)
- [Lend your ideas](https://github.com/orgs/h3ravel/discussions/11)
- [Join the Community on Discord](https://discord.gg/hsG2A8PuGb)

## Basics

- Use `lowercase` for branch names and commit messages for consistency.
- Write concise, clear commit messages; split complex changes into smaller commits if needed.
- Keep commit titles under 72 characters, adding details in the extended description if necessary.
- Address one concern per commit, grouping related changes together and separating unrelated ones.

## Branch Naming

Adopt this branch naming convention for clarity and instant recognition of purpose:

### Format:

`<prefix>/<short-description>`

### Main Prefixes:

- `feat/`: New feature development.
- `fix/`: Bug fixes and corrections.
- `remove/`: Removing files or features.
- `docs/`: Documentation changes.
- `style/`: Visual or formatting updates (no logic changes).
- `refactor/`: Code restructuring without functional changes.
- `perf/`: Performance enhancements.
- `test/`: Test additions or updates.
- `build/`: Build system or dependency modifications.
- `ci/`: Continuous integration updates.
- `chore/`: Routine maintenance tasks.

### Example Branch Names:

- `feat/auth-middleware`
- `fix/translation-error`
- `docs/api-endpoints`
- `style/user-contract-interface`

## Crafting Clear Commits

Write concise, meaningful commit messages to clarify changes for collaborators.

### Commit Format:

`<type>: <what you did>`

### Commit Types:

- `feat`: New feature additions.
- `fix`: Bug fixes and corrections.
- `docs`: Documentation updates.
- `style`: Formatting or visual tweaks.
- `refactor`: Code restructuring, no functional changes.
- `perf`: Performance improvements.
- `test`: Test additions or updates.
- `build`: Dependency or build tool changes.
- `ci`: CI/CD modifications.
- `chore`: Routine maintenance tasks.
- `update`: Minor non-functional improvements.

## Commit Rules

- **Be clear and direct**: Write commits that precisely describe the changes.
- **Use present tense**: E.g., "add email validation" not "added email validation".
- **Avoid vague or temporary commits**: Keep unfinished work in local branches or draft PRs.

### Example Commit Messages

- `feat: implement authentication middleware`
- `fix: fix route resolution issue`
- `docs: update API documentation`
- `style: add typings for user contract interface`

### Why It Matters

A clear commit history streamlines code reviews, collaboration, and debugging, maintaining project organization and quality.

### Thank You for Contributing

Following these recommendation ensures the project’s clarity and success. Share suggestions to improve this guide!
