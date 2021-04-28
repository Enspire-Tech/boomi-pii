const path = require("path");
const flow = require("./package.json").flow;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "boomi-pii-components.js",
        path: path.resolve(__dirname, "public"),
        pathinfo: false
    },
    devtool: "cheap-module-source-map", //inline-source-map',
    devServer: {
        contentBase: "./public"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            { 
                test: /\.tsx?$/, 
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                }
            }, //"awesome-typescript-loader" },
            /*
            { 
                enforce: "pre", 
                test: /\.js$/, 
                loader: "source-map-loader" 
            },
            */
            { 
                test:/\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                  ]
            }
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        new WriteFilePlugin(),
        new MiniCssExtractPlugin({ filename: flow.filenames.css })
    ]
};