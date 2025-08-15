import { createApp } from 'vue'
import './style.css'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import Aura from '@primeuix/themes/aura'
import router from './router';


const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(router).mount('#app')