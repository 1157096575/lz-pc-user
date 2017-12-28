const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin'); //清除文件
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = merge(common, {
  plugins: [
    new CleanWebpackPlugin(['dist']),
    //new webpack.DefinePlugin({
    //  'process.env': {
    //    'NODE_ENV': JSON.stringify('production')
    //  }
    //}),
    // 生产环境使用的（模块标识符）（http://www.css88.com/doc/webpack/guides/caching/）
    new webpack.HashedModuleIdsPlugin(),
    new UglifyJsPlugin({
      compress: {
        warnings: false, // 去除warning警告
        pure_funcs: ['console.log'] // 配置发布时，不被打包的函数
      },
      output: {
        comments: false
      },
      mangle: {
        except: ['$', 'exports', 'require']
      }
    })
  ]
});