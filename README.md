<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Backend API Documentation

## Overview

This backend application is structured with a modular organization in mind, using [NestJS](https://nestjs.com/) as the primary framework and [Prisma](https://www.prisma.io/) as the ORM for database interactions. The application includes several key modules that manage distinct parts of the application (e.g., posts, comments, user management). Each module is designed for scalability, making it easy to add new features.

## Project Structure

### Root Structure

- **`prisma`**: Contains Prisma schema and migration files.
  - **`schema.prisma`**: Defines the database schema for models like posts, users, and comments. This schema is used by Prisma to generate TypeScript types and SQL migrations.
  
- **`src`**: Main source folder for the application.
  - **`decorator`**: Contains custom decorators (e.g., `@IsPostOwner`) to add additional metadata or validation to route handlers.
  - **`guard`**: Houses authorization guards like `PostOwnershipGuard`, which ensures that users can only modify their own posts.
  - **`modules`**: Contains core modules for the application. Each module has its own service, controller, and any additional files.
    - **`comment`**: Manages comment-related business logic.
    - **`post`**: Manages post-related business logic.
    - **`prisma`**: Custom Prisma service that extends `PrismaClient`, responsible for managing database connections.
    - **`user`**: Manages user-related business logic.
  - **`app.controller.ts`**: Root controller for handling initial requests and routing.
  - **`app.module.ts`**: Root module that imports other modules and sets up dependency injection.
  - **`app.service.ts`**: Contains core services for the application (may be unused or minimal in modular apps).
  - **`main.ts`**: Entry point for the application. Configures and starts the NestJS server.

- **`test`**: Contains end-to-end (e2e) tests for validating the overall behavior of the API.
  - **`app.e2e-spec.ts`**: Entry point for e2e tests.
  - **`jest-e2e.json`**: Jest configuration specific to e2e tests.

### Key Files and Directories

- **Prisma Service (`prisma.service.ts`)**  
  A custom Prisma service, extending `PrismaClient`, handles database connections and allows dependency injection of Prisma throughout the application.

- **Modules**  
  Each feature has its own module, with service and controller files:
  - **Comment Module**: Handles all comment-related operations.
  - **Post Module**: Manages post CRUD operations and includes methods for filtering, counting comments, and more.
  - **User Module**: Manages user-related functionality, including checking for existing users.

## API Routes

The backend exposes the following routes:

- **POST** `/post`: Creates a new post.
- **GET** `/post`: Retrieves all posts with optional filtering.
- **GET** `/post/:id`: Retrieves a specific post by ID.
- **PATCH** `/post/:id`: Updates a post (protected by `PostOwnershipGuard`).
- **DELETE** `/post/:id`: Deletes a post (protected by `PostOwnershipGuard`).
- **POST** `/post/:id/comment`: Creates a comment on a post.
- **GET** `/post/:id/comment`: Retrieves all comments for a specific post.

## Unit Testing

The project uses [Jest](https://jestjs.io/) for unit testing:

- Each module has dedicated unit tests, especially for services.
- **Mocking Prisma**: Prisma's client methods are mocked in unit tests to ensure isolated and fast tests without needing a real database connection.


## Environment Configuration

- **.env**: Store environment variables for database connections, API keys, etc. Make sure to set up a `.env` file with values for your environment before running the application.

## Example `.env` file

```dotenv
PORT=3001
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=postgres
POSTGRES_SCHEMA=public
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=${POSTGRES_SCHEMA}"
```
## Project setup

```bash
$ pnpm install
```

## Run Migration
```bash
$ npx prisma migrate dev
```

## Generate Prisma Client (after schema changes)
```bash
$ npx prisma generate
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

```


