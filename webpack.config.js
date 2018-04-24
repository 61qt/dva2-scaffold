const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

/* eslint-disable no-param-reassign */

module.exports = (webpackConfig) => {
  webpackConfig.module.rules.forEach((item) => {
    if (-1 < String(item.loader).indexOf('url-loader')) {
      item.exclude.push(/\.svg$/);
    }
  });

  webpackConfig.plugins = webpackConfig.plugins.concat([
    new SpriteLoaderPlugin(),
  ]);

  webpackConfig.module.rules = ([
    {
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-sprite-loader',
          options: {
            extract: true,
          },
        },
        {
          loader: 'svgo-loader',
          options: {
            plugins: [
              { removeTitle: true },
              { removeStyleElement: true },
            ],
          },
        },
      ],
    },
  ]).concat(webpackConfig.module.rules);

  return webpackConfig;
};

/* eslint-enable */
