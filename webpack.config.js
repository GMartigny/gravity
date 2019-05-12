const webpack = require("webpack");

module.exports = (env, argv) => ({
    entry: "./src/index.js",
    plugins: [
        new webpack.DefinePlugin({
            EDITOR: argv.mode === "development",
        }),
    ],
});
