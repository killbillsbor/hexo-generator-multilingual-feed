var should = require('chai').should();
var Hexo = require('hexo');
var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();
var pathFn = require('path');
var fs = require('fs');
var assign = require('object-assign');
var cheerio = require('cheerio');
var _ = require('lodash');

nunjucks.configure({
  autoescape: false,
  watch: false
});

env.addFilter('uriencode', function(str) {
  return encodeURI(str);
});

var atomTmplSrc = pathFn.join(__dirname, '../atom.xml');
var atomTmpl = nunjucks.compile(fs.readFileSync(atomTmplSrc, 'utf8'), env);
var rss2TmplSrc = pathFn.join(__dirname, '../rss2.xml');
var rss2Tmpl = nunjucks.compile(fs.readFileSync(rss2TmplSrc, 'utf8'), env);

var urlConfig = {
  url: 'http://localhost/',
  root: '/'
};

describe('Feed generator', function() {
  var hexo = new Hexo(__dirname, {
    silent: true
  });
  var Post = hexo.model('Post');
  var generator = require('../lib/generator').bind(hexo);
  var enPosts;
  var esPosts;
  var locals;

  before(function() {
    hexo.config.language = ['en', 'es', 'default'];
  });

  before(function() {
    return Post.insert([{
      source: 'one',
      slug: 'one',
      title: 'one',
      lang: 'en',
      date: 1e8
    }, {
      source: 'two',
      slug: 'two',
      title: 'two',
      lang: 'en',
      date: 1e8 + 1
    }, {
      source: 'three',
      slug: 'three',
      title: 'three',
      lang: 'en',
      date: 1e8 - 1
    }, {
      source: 'uno',
      slug: 'uno',
      title: 'uno',
      lang: 'es',
      date: 1e8
    }, {
      source: 'dos',
      slug: 'dos',
      title: 'dos',
      lang: 'es',
      date: 1e8 + 1
    }, {
      source: 'tres',
      slug: 'tres',
      title: 'tres',
      lang: 'es',
      date: 1e8 - 1
    }]).then(function(data) {
      enPosts = Post.sort('-date').filter(function(post) {
        return post.lang == 'en';
      });
      esPosts = Post.sort('-date').filter(function(post) {
        return post.lang == 'es';
      });
      locals = hexo.locals.toObject();
    });
  });

  it('type = atom', function() {
    hexo.config.feed = {
      type: 'atom',
      path: 'atom.xml',
      limit: 2
    };
    hexo.config = assign(hexo.config, urlConfig);
    var result = generator(locals);

    result.length.should.eql(2);

    result[0].path.should.eql('en/atom.xml');
    result[0].data.should.eql(atomTmpl.render({
      config: hexo.config,
      url: urlConfig.url,
      posts: enPosts.limit(2),
      lang: 'en',
      feed_url: hexo.config.root + 'en/atom.xml'
    }));

    result[1].path.should.eql('es/atom.xml');
    result[1].data.should.eql(atomTmpl.render({
      config: hexo.config,
      url: urlConfig.url,
      posts: esPosts.limit(2),
      lang: 'es',
      feed_url: hexo.config.root + 'es/atom.xml'
    }));
  });

  it('type = rss2', function() {
    hexo.config.feed = {
      type: 'rss2',
      path: 'rss2.xml',
      limit: 2
    };
    hexo.config = assign(hexo.config, urlConfig);
    var result = generator(locals);

    result.length.should.eql(2);

    result[0].path.should.eql('en/rss2.xml');
    result[0].data.should.eql(rss2Tmpl.render({
      config: hexo.config,
      url: urlConfig.url,
      posts: enPosts.limit(2),
      lang: 'en',
      feed_url: hexo.config.root + 'en/rss2.xml'
    }));

    result[1].path.should.eql('es/rss2.xml');
    result[1].data.should.eql(rss2Tmpl.render({
      config: hexo.config,
      url: urlConfig.url,
      posts: esPosts.limit(2),
      lang: 'es',
      feed_url: hexo.config.root + 'es/rss2.xml'
    }));
  });

  it('limit = 0', function() {
    hexo.config.feed = {
      type: 'atom',
      path: 'atom.xml',
      limit: 0
    };
    hexo.config = assign(hexo.config, urlConfig);

    var result = generator(locals);

    result.length.should.eql(2);

    result[0].path.should.eql('en/atom.xml');
    result[0].data.should.eql(atomTmpl.render({
      config: hexo.config,
      url: urlConfig.url,
      posts: enPosts,
      lang: 'en',
      feed_url: hexo.config.root + 'en/atom.xml'
    }));

    result[1].path.should.eql('es/atom.xml');
    result[1].data.should.eql(atomTmpl.render({
      config: hexo.config,
      url: urlConfig.url,
      posts: esPosts,
      lang: 'es',
      feed_url: hexo.config.root + 'es/atom.xml'
    }));
  });

  it('Relative URL handling', function() {
    hexo.config.feed = {
      type: 'atom',
      path: 'atom.xml'
    };

    var checkURL = function(root, path, valid) {
      hexo.config.url = root;
      hexo.config.path = path;

      var result = generator(locals);

      result.length.should.eql(2);

      _.forEach(result, function(lang) {
        var $ = cheerio.load(result[0].data);
        $('feed>id').text().should.eql(valid);
        $('feed>entry>link').attr('href').should.eql(valid);
      });
    }

    checkURL('http://localhost/', '/', 'http://localhost/');

    var GOOD = 'http://localhost/blog/';

    checkURL('http://localhost/blog', '/blog/', GOOD);
    checkURL('http://localhost/blog', '/blog', GOOD);
    checkURL('http://localhost/blog/', '/blog/', GOOD);
    checkURL('http://localhost/blog/', '/blog', GOOD);

    checkURL('http://localhost/b/l/o/g', '/', 'http://localhost/b/l/o/g/');

  });
});
