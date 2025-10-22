import { createRouter, createWebHistory } from 'vue-router'

import layout from "@/components/layout.vue";
import LoginPage from "@/components/loginPage.vue";
import HomePage from "@/components/homePage.vue";
import plcPage from "@/components/plcPage.vue";
import gestioneProfilo from "@/components/gestioneProfilo.vue";
import allarmPage from "@/components/allarmPage.vue"
// ⭐ IMPORTAZIONE AGGIUNTA
import logWarningAllarmi from "@/components/logWarningAllarmi.vue"


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
        path: '', // Corrisponde a /home
        name: 'Home',
        component: HomePage
      },
      {
        path: 'plc1', // Percorso finale: /home/plc1
        name: 'Plc1',
        component: plcPage
        // ⭐ Rimosse le props: non viene iniettato nulla dal router
      },
      {
        path: 'plc2', // Aggiunta la rotta mancante
        name: 'Plc2',
        component: plcPage
      },
      {
        path: 'plc3', // Aggiunta la rotta mancante
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
      // ⭐ NUOVA ROTTA AGGIUNTA PER LO STORICO ALLARMI
      {
        path: '/history/alarms', // Usa il percorso completo se deve essere navigabile dal menu principale
        name: 'HistoricAlarms',
        component: logWarningAllarmi
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
