const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const os = require('os');

let hostip = '0.0.0.0'; //自动获取ip地址
const ifaces = os.networkInterfaces();
for (var dev in ifaces) {
  ifaces[dev].forEach(function (details, alias) {
    if (details.family == 'IPv4' && details.address != '127.0.0.1') {
      hostip = details.address;
    }
  });
}

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    host: hostip,
    inline: true,
    port: 9001,
    open: true,
  }
});