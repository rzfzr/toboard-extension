const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        popup: './src/popup.jsx',
        newtab: './src/newtab.jsx'
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
        })
    ],
};