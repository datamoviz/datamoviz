import Vue from 'vue';
import VueFilter from 'vue-filter';
import 'simplebar/dist/simplebar';

import AppMain from './components/app-main.vue';
import { EventBus } from './event-bus';

Vue.use(VueFilter);

Object.defineProperties(Vue.prototype, {
  $bus: {
    get () {
      return EventBus;
    }
  }
});

new Vue(AppMain).$mount('#app-main');
