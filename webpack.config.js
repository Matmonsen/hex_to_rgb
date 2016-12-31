'use strict';

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = require('yargs').argv.mode;

const libraryName = 'ColorConverter';
const libraryFile = libraryName.toLowerCase();

let plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
        template: './index.html',
    }),
];

let outputFile = libraryFile + '.js';

if (env === 'build') {
    plugins.push(new UglifyJsPlugin({ minimize: true }));
    outputFile = libraryFile + '.min.js';
}

const config = {
    entry: path.resolve(__dirname, 'src/converter.js'),
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        port: 1337
    },
    contentBase: '/',
    output: {
        path: __dirname + '/build',
        filename: outputFile,
        library: libraryName,
    },
    module: {
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/,
                include: path.resolve( __dirname ,'src')
            },
            {
                test: /\.css/,
                loaders: ['style', 'css'],
                include: path.resolve( __dirname ,'src')
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.css']
    },
    plugins: plugins
};

module.exports = config;
