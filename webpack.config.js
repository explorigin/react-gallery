var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProduction = process.env.NODE_ENV == 'production';

var devEntries = isProduction ? [] : [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server'
];

var uglifyJSOptions = {
	"comments": false,
	"mangle": true,
};

var commonPlugins = [
  new ExtractTextPlugin('css/app.css', { allChunks: true })
];
var plugins = isProduction ? [
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin(uglifyJSOptions),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.AggressiveMergingPlugin(),
  new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
] : [
  new webpack.NoErrorsPlugin()
];

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: devEntries.concat(['./index.js']),
    devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        preLoaders: [
          {
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'eslint-loader'
          }
        ],
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel'],
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    'style',
                    'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
                )
            }
        ]
    },
    devServer: {
        contentBase: "./public",
        noInfo: true,
        hot: true,
        inline: true
    },
    plugins: commonPlugins.concat(plugins)
};
