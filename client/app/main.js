import Vue from 'vue';
import Vue2Filters from 'vue2-filters';
import 'font-awesome/scss/font-awesome.scss';
import AppMain from './components/app-main.vue';
import { EventBus } from './event-bus';

Vue.use(Vue2Filters);

Object.defineProperties(Vue.prototype, {
  $bus: {
    get () {
      return EventBus;
    }
  }
});

new Vue(AppMain).$mount('#app-main');
