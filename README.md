# hexo-generator-multilingual-feed

[![Build Status](https://travis-ci.org/ahaasler/hexo-generator-multilingual-feed.svg?branch=master)](https://travis-ci.org/ahaasler/hexo-generator-multilingual-feed)
[![NPM version](https://badge.fury.io/js/hexo-generator-multilingual-feed.svg)](http://badge.fury.io/js/hexo-generator-multilingual-feed)
[![Coverage Status](https://img.shields.io/coveralls/ahaasler/hexo-generator-multilingual-feed.svg)](https://coveralls.io/r/ahaasler/hexo-generator-multilingual-feed?branch=master)
[![Dependency Status](https://gemnasium.com/ahaasler/hexo-generator-multilingual-feed.svg)](https://gemnasium.com/ahaasler/hexo-generator-multilingual-feed)

Multilingual Atom 1.0 or RSS 2.0 feed generator for [Hexo](http://hexo.io).

## Install

``` bash
npm install hexo-generator-multilingual-feed --save
```

## Options

You can configure this plugin in `_config.yml`.

``` yaml
feed:
  type: atom
  path: atom.xml
  limit: 20
```

- **type** - Feed type. (atom/rss2).
- **path** - Feed path. (Default: atom.xml/rss2.xml).
- **limit** - Maximum number of posts in the feed (Use `0` or `false` to show all posts).
