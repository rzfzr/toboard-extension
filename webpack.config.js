const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require("dotenv-webpack");
const webpack = require('webpack')
const ProgressPlugin = require('progress-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const {
    options
} = require('preact');


module.exports = {
    mode: 'production',
    entry: {
        popup: './src/pages/PopupPage.jsx',
        newtab: './src/pages/NewTabPage.jsx',
        options: './src/pages/OptionsPage.jsx',
        background: './src/background.js'
    },
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
        }, {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
        }],
    },
    plugins: [
        new WebpackBuildNotifierPlugin({
            title: "My Webpack Project",
            logo: path.resolve("./img/favicon.png"),
            // suppressSuccess: true, 
        }),
        new ProgressPlugin(true),
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
        aggregateTimeout: 500,
        ignored: './node_modules/',
    },
    resolve: {
        alias: {
            process: require.resolve('process/browser'),
            react: 'preact/compat',
            'react-dom': 'preact/compat',
        },
        fallback: {
            stream: require.resolve("stream-browserify"),
            https: require.resolve("https-browserify"),
            http: require.resolve("stream-http"),
            util: require.resolve("util/"),
            url: require.resolve("url/"),
            buffer: require.resolve("buffer/"),
            child_process: false,
            zlib: false,
            path: false,
            fs: false,
            tls: false,
            net: false,
            assert: false,
            crypto: false,
            querystring: false,
        }
    },
    optimization: {
        concatenateModules: false,
        chunkIds: false,
        minimize: false,
        mangleExports: false,
        mergeDuplicateChunks: false,
    },
    performance: {
        maxAssetSize: 2800000,
        maxEntrypointSize: 2800000,
        hints: "warning"
    }
};