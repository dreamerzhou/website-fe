let path = require("path");
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let HtmlWebpackPlugin = require("html-webpack-plugin");

let WEBPACK_ENV = process.env.WEBPACK_ENV || "dev";
let getHtmlConfig = function(name, title) {
  return {
    template: "./src/view/" + name + ".html",
    filename: "view/" + name + ".html",
    inject: true,
    hash: true,
    title: title,
    chunks: ["common", name]
  };
};

var config = {
  mode: "dev" === WEBPACK_ENV ? "development" : "production",
  entry: {
    common: ["./src/page/common/index.js"],
    index: ["./src/page/index/index.js"],
    login: ["./src/page/login/index.js"]
  },
  output: {
    publicPath: "/dist/",
    filename: "js/[name].js"
  },
  externals: {
    jquery: "window.jQuery"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.string$/,
        use: {
          loader: "html-loader",
          options: {
            minimize: true,
            removeAttributeQuotes: false
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 2048,
              name: "resource/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "resource/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 打包css
    new ExtractTextPlugin("css/[name].css"),
    // html模板处理
    new HtmlWebpackPlugin(getHtmlConfig("index")),
    new HtmlWebpackPlugin(getHtmlConfig("login"))
  ],
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        common: {
          name: "common",
          chunks: "all",
          minChunks: 2
        }
      }
    }
  },
  devServer: {
    port: 8080,
    inline: true,
    proxy: {
      target: "http://test.happymmall.com",
      changeOrigin: true
    }
  }
};

module.exports = config;
