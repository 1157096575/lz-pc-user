var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //把 CSS 分离成文件
const webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var path = require('path');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin; //将公共模块拆出来

/*let siteEnv = {
  name: 'pc project',
  host: 'http://192.168.10.224:7081'
};*/
let siteConfig = require('./config.js')
let siteEnv = siteConfig[process.env.NODE_ENV +'Env'];

function resolve (dir) {
  return path.join(__dirname, './src/static/', dir)
}

//路径定义
var srcDir = path.resolve(process.cwd(), 'src');
//每个html对应一个同名的js
//多入口文件
/*var entries = function() {
  var jsDir = path.resolve(__dirname, srcDir+'/static/js/')
  console.log(jsDir);
  var entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
  console.log(entryFiles);
  var map = {};
  for (var i = 0; i < entryFiles.length; i++) {
    var filePath = entryFiles[i];
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    map[filename] = filePath;
  }
  console.log(map);
  return map;
}*/
//如果js文件夹里有其他js,避免打包多余的js
function getNameFn(st) {
  return st.substring(st.lastIndexOf('\/') + 1, st.lastIndexOf('.'));
}
var entryHtml = glob.sync(srcDir + '/*.html');
var entries = function() {
  var jsDir = path.resolve(__dirname, srcDir+'/static/js/')
  var entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
  var map = {};
  for (var i = 0; i < entryFiles.length; i++) {
    var filePath_js = entryFiles[i];
    var filename_js = getNameFn(filePath_js);
    for (var j = 0; j < entryHtml.length; j++) {
      var filePath = entryHtml[j];
      var filename = getNameFn(filePath);
      if (filename == filename_js) {
        map[filename] = filePath_js;
      }
    }
  }
  return map;
}

//多个html
var html_plugins = function () {
  var r = []
  var entriesFiles = entries()
  for (var i = 0; i < entryHtml.length; i++) {
      var filePath = entryHtml[i];
      var filename = getNameFn(filePath);
      var conf = {
          template: '' + filePath,
          filename: filename + '.html'
      }
      if (filename in entriesFiles) {
          conf.inject = 'body'
          conf.chunks = ['vendor', filename]
      }
      r.push(new HtmlWebpackPlugin(conf))
  }
  return r
};
//插件 用来拓展webpack功能
var plugins = [
  new webpack.NamedModulesPlugin(), //模块热替换
  new webpack.HotModuleReplacementPlugin(), //模块热替换
  new ExtractTextPlugin(
    {
      filename: 'static/css/[name].[contenthash].css',
      //filename: '[name].[contenthash].css',
      disable: false
    }
  ),
  new webpack.ProvidePlugin({ //使用 webpack 的一个插件ProvidePlugin 插件来处理像 jQuery 这样的第三方包
    $: "jquery",
    jQuery: "jquery",
    "windows.jQuery": "jquery",
    Mock: "mockjs",
    doT: 'doT',
    laypage: 'laypage'
  }),
  new webpack.DefinePlugin({
    '__SiteEnv__': JSON.stringify(siteEnv)
  })
];
plugins.push(new CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity
}));
module.exports = {
  //entry: entries(),
  entry: Object.assign(entries(), {
    'vendor': ['doT', 'base', 'mock', 'api-mock','laypage']
  }),
  output: {
    path: path.resolve(__dirname, 'dist'), //path通常用来用来存放打包后文件的输出目录
    filename: 'static/js/[name].[hash].js',
    publicPath: ""  //publicPath则用来指定资源文件引用的虚拟目录 e.g. publicPath: "/assets/"
  },
  plugins: plugins.concat(html_plugins()),
  resolve: {
    extensions: ['.js','.css','json'],
    alias: {
      'doT': resolve('lib/doT.min.js'),
      'base': resolve('js/base/base.js'),
      'mock': 'mockjs',
      'api-mock': resolve('js/mock/api-mock.js'),
      'laypage': resolve('lib/laypage.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'node_modules')
      },
      { test: /\.jsx$/, 
        loader: 'babel-loader', 
        exclude: /node_modules/
      },
      {
        test: /\.(less|css|sass)$/,
        use: [
          {loader:'style-loader'},
          {loader:'css-loader'},
          {loader:'postcss-loader',options: {
            plugins: [
              require('postcss-import'),
              require('autoprefixer')
            ],
            browser: ['last 5 versions']
          }},
          {loader:'less-loader'},
          {loader:'sass-loader'}
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.tpl$/,
        loader: 'ejs-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        /*loaders: [
          'url-loader?limit=50000&name=assets/[name]-[hash:5].[ext]',
          'image-webpack-loader' //压缩图片 跟url-loader file-loader 搭配使用
        ],*/
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'static/images/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            }
          }
        ]
      }
    ]
  }
}