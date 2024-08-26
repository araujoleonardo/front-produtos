import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import NProgress from 'nprogress';
import money from 'v-money';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './index.css'

// Set up FontAwesome icons library
library.add(fas, fab, far);

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(NProgress);
app.use(ElementPlus);
app.use(money);
app.component('font-awesome-icon', FontAwesomeIcon);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')