// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MyTop from '@/components/common/top'
import MyContent from '@/components//common/content'
import MyFooter from '@/components/common/footer'
Vue.config.productionTip = false
Vue.component('my-top',MyTop);
Vue.component('my-content',MyContent);
Vue.component('my-footer',MyFooter);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
