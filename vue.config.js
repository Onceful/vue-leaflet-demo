/*
 * @Author: zxc
 * @Date: 2020-04-28 15:01:57
 * @LastEditTime: 2020-04-28 15:02:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-leaflet-demo\vue.config.js
 */
const webpack = require('webpack')
module.exports = {
    baseUrl: './',

    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    }
}