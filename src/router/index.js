import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from "../components/loginPage.vue";
import HomePage from "../components/homePage.vue";
import plcPage from "@/components/plcPage.vue";

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
  },
  {
    path: '/home/plc1',
    name: 'Plc1',
    component: plcPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router