const { resolve } = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const config = {
    mode: isProd ? 'production' : 'development',
    entry: {
        index: ['babel-polyfill', './src/index.tsx'],
    },
    output: {
        path: resolve(__dirname, 'target'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg|css)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
        ],
    },
};

if (isProd) {
    config.optimization = {
        minimizer: [
            new TerserWebpackPlugin(),
        ],
    };
} else {
    // for more information, see https://webpack.js.org/configuration/dev-server
    config.devServer = {
        port: 8080,
        open: true,
        hot: true,
        compress: true,
        stats: 'errors-only',
        overlay: true,
    };
}

module.exports = config;
