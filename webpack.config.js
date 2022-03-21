const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
        })
    ],
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
        ignored: './node_modules/',
    },
};