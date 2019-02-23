const path = require('path')

module.exports = {
    entry: './dev/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    resolve: { extensions: ['.ts', '.js', '.css', '.scss'] },
    module: {
        rules: [
            { test: /\.tsx?/, use: 'ts-loader' },
            {
                test: /\.scss/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { url: false, sourceMap: true, importLoaders: 2 }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                require('autoprefixer')({grid: true}),
                                require('cssnano')({preset: 'default'})
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dev'),
        compress: true
    }
}