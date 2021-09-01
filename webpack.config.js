const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    stats: 'minimal', // Loggin lvl
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'lightbox.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'test'),
        },
        client: {
            logging: 'error',
            overlay: {
                errors: true,
                warnings: false,
            },
            progress: true,
        },
        compress: true,
        hot: false,
    },
    plugins: [new ESLintPlugin({
        context: './src/index.ts',
    })],
};