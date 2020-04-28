/*
 * @Author: your name
 * @Date: 2020-04-27 10:24:39
 * @LastEditTime: 2020-04-28 16:20:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-leaflet-demo\src\main.js
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import utils from "./utils";

import './assets/style/leaflet.less'

Vue.prototype.$utils = utils;

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");