const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => ({
    entry: "./src/index.js",
    plugins: [
        new HtmlWebpackPlugin({
            title: "Gravity",
        }),
        new DefinePlugin({
            EDITOR: argv.mode === "development",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
});
