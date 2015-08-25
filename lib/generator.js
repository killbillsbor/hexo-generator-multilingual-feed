var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();
var pathFn = require('path');
var fs = require('fs');
var _ = require('lodash');
var multilingual = require('hexo-multilingual');

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

module.exports = function(locals) {
  var config = this.config;
  var result = [];

  function _c(value, lang) {
    return multilingual.util._c(value, lang, config, locals);
  }

  _.forEach(config.language, function(lang) {
    if (lang != 'default') {

      var template = _c('feed.type', lang) === 'rss2' ? rss2Tmpl : atomTmpl;
      var feedLimit = _c('feed.limit', lang);
      var feedPath = lang + '/' + _c('feed.path', lang);

      var posts = locals.posts.sort('-date').filter(function(post) {
        return post.lang == lang;
      });
      if (feedLimit) posts = posts.limit(feedLimit);

      var url = config.url + '/';
      url = url.replace(/([^:])\/\//g, '$1/');

      var xml = template.render({
        config: config,
        url: url,
        posts: posts,
        feed_url: url + feedPath,
        lang: lang,
        _c: function(value) {
          return _c(value, lang);
        }
      });

      result.push({
        path: feedPath,
        data: xml
      });
    }
  });

  return result;
};
