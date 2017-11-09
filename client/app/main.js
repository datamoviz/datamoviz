import Vue from 'vue';
import 'font-awesome/scss/font-awesome.scss';
import AppMain from './components/app-main.vue';
import { EventBus } from './event-bus';

Object.defineProperties(Vue.prototype, {
  $bus: {
    get () {
      return EventBus;
    }
  }
});

new Vue(AppMain).$mount('#app-main');
