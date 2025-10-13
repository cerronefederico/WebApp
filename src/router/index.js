import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from "../components/loginPage.vue";
import HomePage from "../components/homePage.vue";
import plcPage from "@/components/plcPage.vue";
import gestioneProfilo from "@/components/gestioneProfilo.vue";
import allarmPage from "@/components/allarmPage.vue";

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
  },
  {
      path:'/gestioneProfilo',
      name: 'gestioneProfilo',
      component: gestioneProfilo
  },
    {
      path:'/alarms',
      name: 'AllarmPage',
      component: allarmPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router