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

## 🚀 GraphQL and Apollo Plugins

This starter is configured with NestJS's GraphQL module and a custom Apollo plugins implementation located in the `utils` library.

### Apollo Plugins Module

The `ApolloPluginsModule` (`libs/utils/src/lib/apollo-plugins`) provides a reusable service for configuring essential Apollo Server plugins:

-   **`ApolloServerPluginLandingPageLocalDefault`**: Enables the Apollo Studio web client in development for easy query testing.
-   **`ApolloServerPluginDrainHttpServer`**: Ensures graceful server shutdown by draining the HTTP server. This plugin is dynamically added during the `onModuleInit` lifecycle hook when the HTTP server becomes available.

This module is integrated into the main `AppModule` to provide these plugins to the Apollo Server instance.

## 🏥 Health Module

The `HealthModule` (`libs/utils/src/lib/health`) provides Kubernetes-compatible health check endpoints for liveness and readiness probes.

### Endpoints

-   **`GET /health/liveness`**: Returns the liveness status. Used by Kubernetes to determine if the application is running.
-   **`GET /health/readiness`**: Returns the readiness status. Checks if the application is ready to receive traffic, including graceful shutdown detection.

### Components

-   **`HealthController`**: Exposes the health check endpoints using NestJS Terminus.
-   **`ShutdownHealthIndicator`**: Custom health indicator that reports the application's shutdown state.
-   **`ShutdownService`**: Implements `OnApplicationShutdown` to track when the application is shutting down, enabling graceful shutdown handling.

### Testing

The Health module includes comprehensive test coverage:

-   **`HealthController`**: Tests for liveness/readiness endpoints, health check service integration, and error handling.
-   **`ShutdownHealthIndicator`**: Tests for health status reporting (up/down states) and health indicator service integration.
-   **`ShutdownService`**: Tests for shutdown signal handling, static state behavior across instances, and `OnApplicationShutdown` interface implementation.
-   **`HealthModule`**: Tests for module configuration, dependency injection, and TerminusModule integration.

### Apollo Plugins Testing

The `ApolloPluginsService` includes comprehensive test coverage:

-   **Unit Tests:** Verify service initialization and default plugin configuration.
-   **Integration Tests:** Cover scenarios including:
    -   Plugin registration when the HTTP server is available
    -   Graceful handling when the HTTP server is unavailable
    -   Edge cases when `httpAdapter` is undefined

Run the tests with:

```sh
yarn nx test utils
```

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
