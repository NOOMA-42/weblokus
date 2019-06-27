const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: "node",
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: [nodeExternals()],
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 2357
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                /*
                why we should exclude nodemodules
                tl;dr: node_modules should already be runnable without transpiling.
                ref: https://stackoverflow.com/questions/54156617/why-would-we-exclude-node-modules-when-using-babel-loader
                */
                exclude: /(node_modules)/,
                /* 
                ** a question on stackoverflow said colyseus is built upon common JS, it doesn't make 
                much sense to me, reason as follows.
                
                as the upper comment points out, we know the colyseus must run through babel loader.
                babel-loader isn't transpiling colyseus which is included
                node_moudles aka excluded outside.
                */
                include: /colyseus/,
                use: 'babel-loader'
            }
        ]
    },
};