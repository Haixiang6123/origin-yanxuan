import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

// 引入 vue-resouce
import VueResource from 'vue-resource'

// 引入 mint-ui 插件
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

Object.defineProperty(Vue.prototype, '$myhost', {
    value: 'http://localhost:8080'
});

// 使用 Element UI 插件
Vue.use(ElementUI);
// 使用 vue-resouce
Vue.use(VueResource);
// 使用 mint-ui插件
Vue.use(Mint);