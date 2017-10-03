import * as Path from 'path';
import * as webpack from 'webpack';
import * as loaderUtils from 'loader-utils';
import { escapeRegExp } from "lodash";

function resolve(path: string): string {
    return Path.normalize(Path.resolve(__dirname, path));
}

function config(): webpack.Configuration {
    return <webpack.Configuration>{
        context: resolve('src'),
        entry: {
            browser: './browser-demo/browser.ts',
            'webpack-tasks': './browser-demo/webpack-tasks.ts'
        },
        output: {
            path: resolve('out'),
            filename: 'browser-demo/[name].js',
            pathinfo: true
        },
        node: {
            fs: 'empty'
        },
        devtool: 'source-map',
        resolveLoader: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {},
            moduleExtensions: ['-loader']
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {}
        },
        module: {
            rules: [
                // .ts and .tsx
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        // No typechecking in Webpack; just transpilation
                        transpileOnly: true
                    }
                }
            ],
            noParse: [
                new RegExp(escapeRegExp(resolve('node_modules/jquery/dist/jquery.js')))
            ]
        },
        plugins: [],
        devServer: {
            contentBase: Path.join(__dirname, 'out'),
            compress: false,
            port: 9000
        },
    };
}

export default config();