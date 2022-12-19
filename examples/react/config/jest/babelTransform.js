const babelJest = require('babel-jest').default

module.exports = babelJest.createTransformer({
  babelrc: false,
  configFile: false,
  presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-typescript')],
})
