const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const distPath = path.join(__dirname, '/public');

const config = {
    entry: {
        index: './game/index.js'
    },
    output: {
        filename: 'javascripts/index.js',
        path: distPath
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }]
    },


    devServer: {
        contentBase: distPath,
        port: 9000,
        compress: true,
        open: true
    }
};

module.exports = config;