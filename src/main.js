import Vue from 'vue'
Vue.config.devtools = true
Vue.config.productionTip = false

import App from './App.vue'

new Vue({
  render: h => h(App),
}).$mount('#app')

