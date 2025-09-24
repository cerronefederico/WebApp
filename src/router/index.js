import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from "../components/loginPage.vue";
import HomePage from "../components/homePage.vue";

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router