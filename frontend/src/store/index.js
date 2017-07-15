import Vue from 'vue'
import Vuex from 'vuex'

import cart from './modules/cart.js';

import navbar from './modules/navbar.js';
import menu from './modules/menu.js';

// 商品详情
import good from './modules/good.js';

Vue.use(Vuex);

const state = {
    items: []
};

const store = new Vuex.Store({
    state,
    modules: {
        cart,
        navbar,
        menu,
        good
    }
});

export default store;