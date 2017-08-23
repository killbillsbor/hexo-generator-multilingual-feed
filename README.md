# hexo-generator-multilingual-feed

[![Build Status](https://travis-ci.org/ahaasler/hexo-generator-multilingual-feed.svg?branch=master)](https://travis-ci.org/ahaasler/hexo-generator-multilingual-feed)
[![NPM version](https://badge.fury.io/js/hexo-generator-multilingual-feed.svg)](http://badge.fury.io/js/hexo-generator-multilingual-feed)
[![Coverage Status](https://img.shields.io/coveralls/ahaasler/hexo-generator-multilingual-feed.svg)](https://coveralls.io/r/ahaasler/hexo-generator-multilingual-feed?branch=master)
[![Dependency Status](https://gemnasium.com/ahaasler/hexo-generator-multilingual-feed.svg)](https://gemnasium.com/ahaasler/hexo-generator-multilingual-feed)
[![License](https://img.shields.io/badge/license-MIT%20License-blue.svg)](LICENSE)

Multilingual Atom 1.0 or RSS 2.0 feed generator for [Hexo](http://hexo.io/).

## Install

``` bash
npm install hexo-generator-multilingual-feed --save
```

## Options

You can configure this plugin in `_config.yml`:

``` yaml
feed:
  type: atom
  path: atom.xml
  limit: 20
```

Optionally you can add `base`:

``` yaml
feed:
  base: https://yourdomain.com/subfolder/
```

- **base** — Post URL base. It might be useful for web sites in subfolders (optional).
- **type** — Feed type. (atom/rss2. Default: atom).
- **path** — Feed path. (Default: atom.xml/rss2.xml).
- **limit** — Maximum number of posts in the feed (Use `0` or `false` to show all posts. Default: 20).

### Localizable configuration

These are the values that this generator uses and can be [localized](https://github.com/ahaasler/hexo-multilingual#_c-configuration-locales "Configuring locales"):

- feed
  - type
  - path
  - limit
- title
- subtitle
- description
- author
- email

## License

MIT
