# js13k 2016
This is the place where I describe the game.

## Concept
This is the place where I describe how the theme is applicable to the game.

## Setup
Clone or download this repository, load dependencies: `npm install`.
Requires [node/npm](http://nodejs.org).

## Scripts

### `npm run dist`
Compiles minified code, packages in zip, checks the file size.

### `npm run start`
Watches `src`, compiles unminifed code, runs `http-server`.

### `npm run test`
Runs unit tests and code coverage.

## Tasks

### `tasks/build`
Uses a custom `defreq` tool, which traces required modules, and concatenates
them into a single file, with simple `define` and `require` functions. The
result is written to `stdout`.

### `tasks/embed`
Wraps the content streamed from `stdin` in a basic html template, and writes
the result to `stdout`.

### `tasks/minify`
Minimizes the javascript content streamed from `stdin`, with `uglify-js`, and
writes the result to `stdout`.

### `tasks/size`
Checks the filesize, in kb, of the `dist.zip` artifact.

### `tasks/zip`
Compresses the content streamed from `stdin` into a basic zip archive, writes
the result to `stdout`.
