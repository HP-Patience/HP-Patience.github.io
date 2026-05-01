/* global hexo */
'use strict';

const pagination = require('hexo-pagination');

hexo.extend.generator.register('story', function(locals) {
  const config = hexo.config;
  const paginationDir = config.pagination_dir || 'page';

  const posts = locals.posts.filter(post => {
    if (!post.categories || !post.categories.length) return false;
    if (!post.categories.data || !post.categories.data.length) return false;
    const categoryNames = post.categories.data.map(cat => cat.name);
    return categoryNames.includes('Story');
  }).sort('-date');

  if (!posts.length) return;

  return pagination('story/', posts, {
    perPage: config.per_page || 10,
    layout: ['story', 'index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      type: 'story'
    }
  });
});
