const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require("dotenv-webpack");
const webpack = require('webpack')
const {
    options
} = require('preact');

module.exports = {
    mode: 'production',
    entry: {
        popup: './src/popup.jsx',
        newtab: './src/newtab.jsx',
        options: './src/options.jsx'
    },
    // target: 'node',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
        }, ],
    },
    plugins: [
        new Dotenv(),
        new webpack.DefinePlugin({
            'process.env.NODE_DEBUG': JSON.stringify('development'),
        }),
        new CopyPlugin({
            patterns: [{
                from: "public"
            }, ],
        }),
        new HtmlWebpackPlugin({
            chunks: ['newtab'],
            template: 'template.html',
            filename: 'newtab.html'
        }),
        new HtmlWebpackPlugin({
            chunks: ['popup'],
            template: 'template.html',
            filename: 'popup.html'
        }),
        new HtmlWebpackPlugin({
            chunks: ['options'],
            template: 'template.html',
            filename: 'options.html'
        }),
        new webpack.ProvidePlugin({
            process: require.resolve('process/browser'),
            Buffer: ["buffer", "Buffer"],
        }),

    ],
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
        ignored: './node_modules/',
    },
    resolve: {
        alias: {
            process: require.resolve('process/browser'),
        },
        fallback: {
            child_process: false,
            toggl: require.resolve("toggl-api"),
            util: require.resolve("util/"),
            tls: require.resolve("tls-browserify"),
            net: require.resolve("net"),
            fs: require.resolve("browserify-fs"),
            assert: require.resolve("assert/"),
            https: require.resolve("https-browserify"),
            http: require.resolve("stream-http"),
            url: require.resolve("url/"),
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            buffer: require.resolve("buffer/"),
            zlib: require.resolve("browserify-zlib"),
            path: require.resolve("path-browserify"),
        }
    }
};