var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

// 生成webpack的配置
module.exports = {
    devtool: "source-map",
    entry: path.resolve('./app/src/index.js'),

    // 有两种方式很方便地导入外部库：
    // 1. 使用alias映射到本地文件 -- 最终可以通过CommonsChunkPlugin合并到vendors.js中
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx"]
    },
    // 2. 通过externals导入外部的全局变量：
    externals: {
         //从window变量中导入的外部变量
        'fs': 'window.fs',
        'path': 'window.path',
        'child_process': 'window.child_process',
        'xlsx': 'window.xlsx',
        //'jquery': 'window.jQuery',
        //'common': 'window.Common',
        //'app/common': 'window.Common',
        //'requirejs': 'window.require',
        //'amd-require': 'window.require',
        //'amd-define': 'window.define',
        //'react': 'window.React',
        //'react-dom': 'window.ReactDOM',
        //'promise': 'window.Promise',
        //'es6-promise': 'window.Promise',
        //'mainaer': 'window.Mainaer'
    },
    output: {
        path:  path.resolve(__dirname, 'app/packed'),
        filename: 'index.js'
    },
    module: {
        preLoaders: [
            //{test: /\.js$/, loader: "source-map-loader"}
        ],
        loaders: [
            //{ test: /\.(js|ts)$/, loader: 'babel' },
            //{ test: /\.jsx$/, loader: 'babel?presets=react' },
            //{ test: /\.tsx$/, loader: 'ts-loader' },
            //{ test: /\.jade$/, loader: 'jade' },
            //{ test: /\.json$/, loader: 'json' },
            //{ test: /\.yaml$/, loader: 'json!yaml' },
            //{ test: /\.png$/, loader: 'url-loader?mimetype=image/png' },
            //{ test: /\.jpg$/, loader: 'url-loader?mimetype=image/jpg' },
            //{ test: /\.gif$/, loader: 'url-loader?mimetype=image/gif' },
            //{ test: /\.css$/, loader: 'style!css' },
            //{ test: /\.less$/, loader: 'style!css!less' },
            //{ test: /\.(htm|html|tpl)$/, loader: 'html' },
            //{ test: /\.txt$/, loader: 'raw' }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            output: { comments: false }
        })
    ]
};

