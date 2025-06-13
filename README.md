# Create App Template

A CLI tool to scaffold applications from templates with optional modular features.

## Quick Start

```bash
# Create and enter working directory
mkdir my-new-app
cd my-new-app

# Install the CLI tool
npx create-app-template@latest --framework react --branch hello-world --directory .
```

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