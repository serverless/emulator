# Local Emulator

> Emulate your Serverless functions locally.

## Getting started

1. Clone the repository
2. Run `npm install` to install all dependencies
3. Run `npm build` to build the project (the build artifacts can be found in `dist`)
4. Run `npm start` to start the emulator

## Development

You can run `npm watch` to automatically re-build the files in the `src` directory when they change.

Additionally you can use Docker to run and develop everything inside a container.

Spinning up the Docker container is as easy as `docker-compose run -p 8080:8080 node bash`.
