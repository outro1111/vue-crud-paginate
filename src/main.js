import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import '@/assets/global.css'

const app = createApp(App)
app.config.globalProperties.$axios = axios; // axios를 전역변수로 설정 컴포넌트에서 this.$axios로 호출할 수 있음
app.config.globalProperties.baseURL = 'http://localhost:3000' // axios baseURL 설정
app.use(router).mount('#app')
