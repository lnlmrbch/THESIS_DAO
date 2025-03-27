const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    https: require.resolve("https-browserify"),
    http: require.resolve("stream-http"),
    util: require.resolve("util/"),
    assert: require.resolve("assert/"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser"),
    url: require.resolve("url/")
  };

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ];
  
  config.module.rules = config.module.rules.map(rule => {
    if (rule.use && rule.use.loader === 'source-map-loader') {
      rule.exclude = [/node_modules\/@meteorwallet\/sdk/];
    }
    return rule;
  });

  return config;
};
