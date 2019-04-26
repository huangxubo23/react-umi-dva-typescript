
'use strict';


let path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
var fs = require('fs');
const args = require('minimist')(process.argv.slice(2));
let v = read('/acs/conf/env.properties');
let locahost = Object.keys(v);
if (locahost.length == 0) {
    v = read('C:/acs/conf/env.properties');
}
var s = 'port.NODE_PORT';
var port = v[s] ? v[s] : 5000;
console.log("端口号：" + port);
let conf = {
    // mode: "production",
    devtool: 'inline-source-map',
    entry: {app: ['./src/index']},
    // target: 'electron-renderer',
    output: {
        path: path.resolve(__dirname, args.dist == "front" ? "../wzg_pc_front/dist" : "./dist/"), // string
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）
        //  publicPath: "/assets/", // string
        // 输出解析文件的目录，url 相对于 HTML 页面
        filename: "pc/assets/[name].js",
        chunkFilename: '[name].js',
        // publicPath: args.dist == "front" ? '/wzg/' : "/",
        publicPath: '/',
        library: "MyLibrary", // string,
        // 导出库(exported library)的名称
        libraryTarget: "umd", // 通用模块定义
        // 导出库(exported library)的类型
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.(css|less)$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: ['file-loader?limit=8192&name=pc/resources/images/[hash:8].[name].[ext]']
            },
            {
                test: /\.(ogg|svg|eot|ttf|dtd|woff|woff2)$/,
                loader: ['file-loader?limit=50000&name=pc/resources/fonts/[hash:8].[name].[ext]']
            }
        ]
    },
    devServer: {
        port: port,
        host: '0.0.0.0',
        proxy: proxy(args.data_env),
        contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
        compress: true, // enable gzip compression
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: false, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false, // true for self-signed, object for cert authority
        noInfo: true, // only errors & warns on hot reload
        disableHostCheck: true
        // ...
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: './src/index.html',
                // inject: false, //允许插件修改哪些内容,包括head与body
                minify: { //压缩HTML文件
                    removeComments: true,//移除HTML中的注释
                    collapseWhitespace: true //删除空白符与换行符
                }
            }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            React: 'react',
            ReactDOM: 'react-dom',
            // Bundle: path.resolve(__dirname, './src/bundle'),
            // ReactChild:path.resolve(__dirname, './src/components/lib/util/ReactChild')
        }),


        new CopyWebpackPlugin([
            {
                from: 'src/copy/status.check',
                to: "status.check",
                flatten: true
            }, {
                from: 'src/copy/loginSuccess.html',
                to: "pc/loginSuccess.html",
                flatten: true
            }, {
                from: 'src/copy/root.txt',
                to: "pc/root.txt",
                flatten: true
            }, {
                from: 'src/copy/whiteList.htm',
                to: "pc/whiteList.htm",
                flatten: true
            }])
    ], optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups:args.mode == "development"?{
                libAll: {
                    test: /workload[\\/]/,
                    name: "pc/assets/lib/libAll",
                    reuseExistingChunk: true,
                    priority: 18,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                    name: 'pc/assets/lib/default'
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    name: 'pc/assets/lib/vendor'
                }
            }:{
                react: {
                    test: /react[\\/]|react-dom[\\/]|react-router[\\/]/,
                    name: "pc/assets/lib/react-router",
                    reuseExistingChunk: true,
                    priority: 21,
                }, reactBootstrap: {
                    test: /react-bootstrap[\\/]|bootstrap-switch[\\/]/,
                    name: "pc/assets/lib/react-bootstrap",
                    reuseExistingChunk: true,
                    priority: 20,
                },
                element: {
                    test: /element-react[\\/]|element-theme-default[\\/]/,
                    priority: 19,
                    reuseExistingChunk: true,
                    name: 'pc/assets/lib/element'
                },
                workload: {
                    test: /workload[\\/]/,
                    name: "pc/assets/lib/workload",
                    reuseExistingChunk: true,
                    priority: 18,
                }, editBox: {
                    test: /[\\/]editBox[\\/]/,
                    name: "pc/assets/lib/editBox",
                    reuseExistingChunk: true,
                    priority: 18,
                },
                selectionOfPool: {
                    test: /[\\/]selectionOfPool[\\/]/,
                    name: "pc/assets/lib/selectionOfPool",
                    reuseExistingChunk: true,
                    priority: 14,
                },
                upload: {
                    test: /[\\/]upload[\\/]/,
                    name: "pc/assets/lib/upload",
                    reuseExistingChunk: true,
                    priority: 10,
                }, bindParties: {
                    test: /[\\/]bindParties[\\/]/,
                    name: "pc/assets/lib/bindParties",
                    reuseExistingChunk: true,
                    priority: 10,
                },
                util: {
                    test: /[\\/]lib[\\/]util[\\/]|[\\/]lib[\\/]newUtil[\\/]/,
                    name: "pc/assets/lib/util",
                    reuseExistingChunk: true,
                    priority: 12,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                    name: 'pc/assets/lib/default'
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    name: 'pc/assets/lib/vendor'
                }
            }
        },
    }, performance: {
        ///hints: true  //提示
    }
}

if (args.mode == "development") {
    console.log("开启热部署")
    conf.plugins.push(new webpack.HotModuleReplacementPlugin());//热模块替换
    conf.plugins.push(new webpack.NamedModulesPlugin());//热模块替换
    conf.devServer.hot = true;
}

module.exports = conf;


function proxy(data_env) {
    if (data_env == "loc") {
        return {
            '/user': {target: 'http://localhost.52wzg.com:8081', changeOrigin: true, pathRewrite: {"^/user": ""}},
            '/forum': {target: 'http://localhost.52wzg.com:8083', changeOrigin: true, pathRewrite: {"^/forum": ""}},
            '/content': {target: 'http://localhost.52wzg.com:8080', changeOrigin: true, pathRewrite: {"^/content": ""}},
            '/mission': {target: 'http://localhost.52wzg.com:8084', changeOrigin: true, pathRewrite: {"^/mission": ""}},
            '/message': {target: 'http://localhost.52wzg.com:8082', changeOrigin: true, pathRewrite: {"^/message": ""}}
        }
    }else if(data_env == "ml"){
        return {
            '/user': {target: 'http://localhost:8881', changeOrigin: true, pathRewrite: {"^/user": ""}},
            '/forum': {target: 'http://localhost:8883', changeOrigin: true, pathRewrite: {"^/forum": ""}},
            '/content': {target: 'http://localhost:8880', changeOrigin: true, pathRewrite: {"^/content": ""}},
            '/mission': {target: 'http://localhost:8884', changeOrigin: true, pathRewrite: {"^/mission": ""}},
            '/message': {target: 'http://localhost:8882', changeOrigin: true, pathRewrite: {"^/message": ""}}
        }
    } else if (data_env == "online") {
        return {
            '/user': {target: 'http://user.52wzg.com', changeOrigin: true, pathRewrite: {"^/user": ""}},
            '/forum': {target: 'http://bbs.52wzg.com', changeOrigin: true, pathRewrite: {"^/forum": ""}},
            '/content': {target: 'http://content.52wzg.com', changeOrigin: true, pathRewrite: {"^/content": ""}},
            '/mission': {target: 'http://mission.52wzg.com', changeOrigin: true, pathRewrite: {"^/mission": ""}},
            '/message': {target: 'http://message.52wzg.com', changeOrigin: true, pathRewrite: {"^/message": ""}}
        }
    } else if (data_env == "online_internal") {
        return {
            '/user': {target: ' https://user.hz-internal.taeapp.com', changeOrigin: true, pathRewrite: {"^/user": ""}},
            '/forum': {target: 'https://wbbs.hz-internal.taeapp.com', changeOrigin: true, pathRewrite: {"^/forum": ""}},
            '/content': {
                target: 'https://drzlcon.hz-internal.taeapp.com',
                changeOrigin: true,
                pathRewrite: {"^/content": ""}
            },
            '/mission': {
                target: 'https://mission.hz-internal.taeapp.com',
                changeOrigin: true,
                pathRewrite: {"^/mission": ""}
            },
            '/message': {
                target: 'https://message.hz-internal.taeapp.com',
                changeOrigin: true,
                pathRewrite: {"^/message": ""}
            }
        }
    }
    return {};
}

function read(uri, encoding) {
    encoding = encoding == null ? 'UTF-8' : encoding;  //定义编码类型
    try {
        var content = fs.readFileSync(uri, encoding);
        var regexjing = /\s*(#+)/;  //去除注释行的正则
        var regexkong = /\s*=\s*/;  //去除=号前后的空格的正则
        var keyvalue = {};  //存储键值对

        var arr_case = null;
        var regexline = /.+/g;  //匹配换行符以外的所有字符的正则
        while (arr_case = regexline.exec(content)) {  //过滤掉空行
            if (!regexjing.test(arr_case)) {  //去除注释行
                keyvalue[arr_case.toString().split(regexkong)[0]] = arr_case.toString().split(regexkong)[1];  //存储键值对
                // console.log(arr_case.toString());
            }
        }
    } catch (e) {
        //e.message  //这里根据自己的需求返回
        return {};
    }
    return keyvalue;
}
