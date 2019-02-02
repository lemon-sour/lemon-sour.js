# :lemon: lemon-sour :lemon:
  <a href="https://circleci.com/gh/lemon-sour/lemon-sour.js"><img src="https://badgen.net/circleci/github/lemon-sour/lemon-sour.js/master" alt="Build Status"></a>
  <a href="https://codecov.io/gh/lemon-sour/lemon-sour.js"><img src="https://badgen.net/codecov/c/github/lemon-sour/lemon-sour.js/master" alt="Coverage Status"></a>
  <a href="https://www.npmjs.com/package/lemon-sour"><img src="https://badgen.net/npm/dm/lemon-sour" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/lemon-sour"><img src="https://badgen.net/npm/v/lemon-sour" alt="Version"></a>
  <a href="https://www.npmjs.com/package/lemon-sour"><img src="https://badgen.net/npm/license/lemon-sour" alt="License"></a>
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request)

<a href="https://www.patreon.com/hisasann" rel="nofollow">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160" style="max-width:100%;">
</a>

---

<p align="center">
  <img src="https://github.com/lemon-sour/lemon-sour.js/blob/master/internals/images/lemon-sour.jpg?raw=true" alt="lemon-sour.jpg" width="200">
</p>

## Links

- 📘 Documentation: https://github.com/lemon-sour/docs
- 🐦 Twitter: [@hisasann](https://twitter.com/hisasann)

## Installation

Using yarn:

```bash
yarn global add lemon-sour
```

Using npm:

```bash
npm i lemon-sour -g
```

## Getting started

Make `index.yml` inside your project:

```yaml
version: 1.0
jobs:
  install_app_a:
    name: app_a
    latest_json_url: http://localhost:3000/app_basic_no_archive/latest.json
    is_archive: false
    output_path: C:\lemon-sour\app_basic_no_archive
    events:
      checking_for_update:
        steps:
          - run:
              name: Nodejs Version
              command: node --version
      update_not_available:
        steps:
          - run:
              name: NPM Version
              command: npm --version
              sync: true
      update_available:
      download_progress:
      update_downloaded:
      error:

workflows:
  main:
    jobs:
      - install_app_a
```

`latest.json` like this

```json
{
  "latestVersion": "1.0.0",
  "fileUrl": "http://localhost:3000/app_basic_no_archive/index.txt",
  "sha1": "3f786850e387550fdab836ed7e6dc881de23001b",
  "releaseDate": "2019-01-18 19:29:45"
}
```

And then run:

```
$ lemon-sour --yml index.yml
```

## Maintainers

- [hisasann (Yoshiyuki Hisamatsu)](https://github.com/hisasann)

## License

MIT © [hisasann (Yoshiyuki Hisamatsu)](https://github.com/hisasann)

<a href="https://twitter.com/hisasann"><img src="https://badgen.net/twitter/follow/hisasann" alt="twitter"></a>
