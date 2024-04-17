const path = require("path")

const config = {
  /* webpack 的输入、输出 */
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "main.js"
  },

  /* webpack-dev-server 自动 bundle 并刷新浏览器 */
  devServer: {
    static: path.resolve(__dirname, "build"),
    compress: true,
    port: 3000,
  },

  /* error map */
  devtool: "source-map",

  /* babel、css、style loader*/
  module: {
    rules: [
      // first loader: jsx to js, es6、es7 to es5
      {
        test: /\.js$/,
        loader: "babel-loader", 
        options: {
          presets: ["@babel/preset-react", "@babel/preset-env"]
        }
      },
      // second loader: css\style loader
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }
    ]
  }
}

module.exports = config