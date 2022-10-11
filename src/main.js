import 'vuetify/styles'
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from "pinia"

loadFonts()
const pinia = createPinia()

createApp(App)
  .use(vuetify)
  .use(pinia)
  .mount('#app')

// https://a2i2.deakin.edu.au/2020/04/23/real-time-data-transfer-using-vue-and-socket-io-part-1-of-3/
