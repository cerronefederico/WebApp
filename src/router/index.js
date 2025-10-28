import { createRouter, createWebHistory } from 'vue-router'

import layout from "@/components/layout.vue";
import LoginPage from "@/components/loginPage.vue";
import HomePage from "@/components/homePage.vue";
import plcPage from "@/components/plcPage.vue";
import gestioneProfilo from "@/components/gestioneProfilo.vue";
import allarmPage from "@/components/allarmPage.vue"
// ⭐ IMPORTAZIONE AGGIUNTA
import logWarningAllarmi from "@/components/logWarningAllarmi.vue"
import ReportisticaCompleta from "@/components/ReportisticaCompleta.vue";
import DatiProduzione from "@/components/DatiProduzione.vue";


const routes = [
  // ROTTA 1: Login
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },

  // ROTTA 2: Layout
  {
    path: '/home',
    component: layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: HomePage
      },
      {
        path: 'plc1',
        name: 'Plc1',
        component: plcPage
      },
      {
        path: 'plc2',
        name: 'Plc2',
        component: plcPage
      },
      {
        path: 'plc3',
        name: 'Plc3',
        component: plcPage
      },
      {
          path:'gestioneProfilo',
          name: 'gestioneProfilo',
          component: gestioneProfilo
      },
      {
          path:'alarms',
          name: 'AllarmPage',
          component: allarmPage
      },
      {
        path: '/history/alarms',
        name: 'HistoricAlarms',
        component: logWarningAllarmi
      },
      {
          path:'/history/report',
          name:'ReportDati',
          component: ReportisticaCompleta
      },
      {
          path:'/history/datiprod',
          name:'DatiProduzione',
          component: DatiProduzione
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
