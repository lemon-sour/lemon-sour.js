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

## Links

- 📘 Documentation: https://github.com/lemon-sour/docs
- 🐦 Twitter: [@hisasann](https://twitter.com/hisasann)

## Getting started

```
$ yarn global add lemon-sour
```

Make `index.yml` inside your project:

```yaml
version: 1.0
jobs:
  install_app_a:
    latest_json_url: https://s3-ap-northeast-1.amazonaws.com/lemon-sour-example/app_a/latest.json
    is_archive: false
    output_path: C:\lemon-sour\app_a
    events:
      - checking_for_update:
      - update_not_available:
      - update_available:
        steps:
            - run:
                name: Nodejs Version
                command: node --version
            - run:
                name: Npm Version
                command: npm --version
      - download_progress:
      - update_downloaded:
      - error:

workflows:
  main:
    jobs:
      - install_app_a
```

And then run:

```
$ lemon-sour --yml ./example.yml
```

## Maintainers

- [hisasann (Yoshiyuki Hisamatsu)](https://github.com/hisasann)

## License

MIT © [hisasann (Yoshiyuki Hisamatsu)](https://github.com/hisasann)

<a href="https://twitter.com/hisasann"><img src="https://badgen.net/twitter/follow/hisasann" alt="twitter"></a>
