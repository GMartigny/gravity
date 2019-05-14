const webpack = require("webpack");
const { resolve } = require("path");

module.exports = (env, argv) => ({
    entry: "./src/index.js",
    output: {
        path: resolve("./"),
    },
    plugins: [
        new webpack.DefinePlugin({
            EDITOR: argv.mode === "development",
        }),
    ],
});
