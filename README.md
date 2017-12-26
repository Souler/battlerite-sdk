# Battlerite SDK
NodeJS wraper for the official Battlerite API

  [![NPM Version][npm-image]][npm-url]
  [![Build Status][travis-image]][travis-url]
  [![Test Coverage][coveralls-image]][coveralls-url]

```js
import { BattleriteApi } from 'battlerite-sdk';

const api = new BattleriteApi('___API_KEY____');

// Print some info about recent matches history
api.getMatches().then((matches) => {
  console.log(`Found ${matches.lenght} matches`);
  matches.forEach((match) => {
    console.log(`Match ${match.id} duration was ${match.duration}`);
  });
});
```

## Installation
[battlerite-sdk][npm-url] is available at npm registry and requires NodeJS
version 6.

```
$ yarn install battlerite-sdk
```

## Usage
**Work in progress**

## Contributing
```
git clone git@github.com:souler/battlerite-sdk.git
cd battlerite-sdk
yarn install
yarn test
```

This will clone the project and run the tests (which probably will fail).

## License
[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/battlerite-sdk.svg
[npm-url]: https://npmjs.org/package/battlerite-sdk
[travis-image]: https://img.shields.io/travis/Souler/battlerite-sdk/master.svg
[travis-url]:  https://travis-ci.org/Souler/battlerite-sdk
[coveralls-image]: https://img.shields.io/coveralls/Souler/battlerite-sdk/master.svg
[coveralls-url]: https://coveralls.io/r/Souler/battlerite-sdk?branch=master
