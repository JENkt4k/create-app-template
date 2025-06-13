# Create App Template

![CI](https://github.com/JENkt4k/create-app-template/workflows/CI/badge.svg)

A CLI tool to scaffold applications from templates with optional modular features.

## Quick Start

### Development Setup (Current)
```bash
# Clone the repository
git clone https://github.com/JENkt4k/create-app-template.git

# Install dependencies
cd create-app-template
npm install

# Link for local development
npm link

# Now you can run from anywhere
create-app-template --framework react --branch hello-world --directory my-app
```

### Future Usage (After npm publish)
```bash
# This will work after the package is published to npm
npx create-app-template@latest --framework react --branch hello-world --directory my-app
```

## Note on Current Status
- Package is not yet published to npm
- Currently requires local setup
- Will support `npx` usage after first npm publish
- Track issue #X for npm publish status

## Detailed Workflow

### 1. Prerequisites
- Node.js 16 or higher
- Git

### 2. Create New Project
```bash
# Create project directory
mkdir my-project
cd my-project

# Install and run CLI
npx create-app-template@latest --framework react --branch hello-world --directory .
```

### 3. Add Optional Modules
```bash
# Include auth-oauth module from auth-oauth branch
npx create-app-template@latest --framework react --branch hello-world --include auth-oauth --module-branch auth-oauth --directory .
```

## Available Templates

Currently supported template:
- React Template ([JENkt4k/launchpad-react-template](https://github.com/JENkt4k/launchpad-react-template))
  - Base branch: `hello-world`
  - Available modules:
    - `auth-oauth` (branch: `auth-oauth`)

## CLI Options

| Option | Description | Example |
|--------|-------------|---------|
| `--framework` | Template framework to use | `--framework react` |
| `--branch` | Template branch to use | `--branch hello-world` |
| `--include` | Modules to include | `--include auth-oauth` |
| `--module-branch` | Branch for modules | `--module-branch auth-oauth` |
| `--directory` | Output directory | `--directory .` |

## Examples

### Create Basic React App
```bash
npx create-app-template@latest --framework react --branch hello-world --directory my-app
```

### Create React App with Auth
```bash
npx create-app-template@latest --framework react --branch hello-world --include auth-oauth --module-branch auth-oauth --directory my-app
```

## Development

### Local Testing
```bash
git clone https://github.com/JENkt4k/create-app-template.git
cd create-app-template
npm install
npm test
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Submit a pull request

## License
MIT

# Modules Directory

This directory contains reusable feature modules for `create-app-template`.

- Modules can be copied locally or fetched from a remote repo/branch.
- To add a new module, create a subdirectory here.
- To fetch the latest version, use the CLI with `--include` and configure the remote repo/branch as needed.

## Usage Patterns

### 1. Create New Project with Modules
```bash
npx create-app-template@latest \
  --framework react \
  --branch hello-world \
  --include auth-oauth \
  --module-branch auth-oauth \
  --directory my-new-app
```

### 2. Add Module to Existing Project
```bash
# From your project directory:
npx create-app-template@latest \
  --framework react \
  --include auth-oauth \
  --module-branch auth-oauth \
  --directory .
```

The CLI will:
1. Skip template clone if no --branch is specified
2. Fetch and add only the requested modules
3. Preserve existing files
4. Place modules in the `modules` directory