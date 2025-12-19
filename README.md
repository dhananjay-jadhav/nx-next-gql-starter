# Nx + Nest Starter

<div align="center">
  <a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

<br>

A minimal starter template for building applications with [Nx](https://nx.dev) and [NestJS](https://nestjs.com). This repository is configured with a basic API application, a utility library, and a GitHub Actions workflow for continuous integration.

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/dhananjay-jadhav/nx-nest-starter.git
    cd nx-nest-starter
    ```

2.  **Install dependencies:**
    ```sh
    yarn install
    ```

## 🛠️ Development

This workspace is structured with a main application (`api`) and a shared library (`utils`).

### Running the Development Server

To start the NestJS API in development mode with hot-reloading:

```sh
yarn nx serve api
```

The API will be available at `http://localhost:3000`.

### Key Commands

-   **Build:** Create a production-ready build of the application.

    ```sh
    yarn nx build api
    ```

-   **Test:** Run unit tests for all projects.

    ```sh
    yarn nx test api
    yarn nx test utils
    ```

-   **Lint:** Lint all projects in the workspace.

    ```sh
    yarn nx lint api
    yarn nx lint utils
    ```

-   **Run Multiple Tasks:** Use `run-many` to execute a target against multiple projects. For example, to lint and test all projects:
    ```sh
    yarn nx run-many --targets=lint,test --all --parallel
    ```

## CI/CD

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/ci.yml`. The workflow is triggered on every push and pull request to the `main` branch.

It performs the following steps:

1.  Installs dependencies.
2.  Runs linting, testing, and building for all projects in parallel to ensure code quality and correctness.

## 📁 Workspace Structure

```
nx-nest-starter/
├── apps/
│   ├── api/              # NestJS main application
│   └── api-e2e/          # End-to-end tests for the API
├── libs/
│   └── utils/            # Shared utility library
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions CI workflow
├── nx.json               # Nx workspace configuration
└── package.json          # Project dependencies
```

## ✨ Learn More

-   **Nx:** [Official Documentation](https://nx.dev/getting-started/intro)
-   **NestJS:** [Official Documentation](https://docs.nestjs.com/)
