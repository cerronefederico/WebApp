import { defineStore } from 'pinia';
import { allPlcStoresHooks } from './index';

export const useWebSocketStore = defineStore('websocketConnection', {
  state: () => ({
    socket: null,
    isConnected: false,
    reconnectTimer: null,
      isDataReady: false,
  }),
  actions: {
    connect() {
      if (this.socket && this.isConnected) return;

      this.socket = new WebSocket("ws://localhost:8000/ws/plc1/contatori");

      this.socket.onopen = () => {
        this.isConnected = true;
        console.log("WebSocket connesso. Pronto per i dati in tempo reale.");
      };

    this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
        // Imposta il flag a TRUE dopo il primo messaggio
        if (!this.isDataReady) {
            this.isDataReady = true;
            console.log("Primo pacchetto dati PLC ricevuto.");
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        console.log("WebSocket disconnesso. Riconnessione tra 3s...");
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      };

      this.socket.onerror = (error) => {
        console.error("Errore WebSocket:", error);
        this.socket.close();
      };
    },

    handleMessage(allPlcData) {
        for (const plcId in allPlcData) {
            if (allPlcStoresHooks[plcId]) {
                const useStoreHook = allPlcStoresHooks[plcId];
                const plcStore = useStoreHook();
                if (allPlcData[plcId].stati !== undefined) {
                    plcStore.setStati(allPlcData[plcId].stati);
                }
                if (allPlcData[plcId].contatori !== undefined) {
                    plcStore.setContatori(allPlcData[plcId].contatori);
                }
                if (allPlcData[plcId].notifiche !== undefined) {
                    plcStore.setNotifiche(allPlcData[plcId].notifiche);
                }
            }
        }
    },

    disconnect() {
      clearTimeout(this.reconnectTimer);
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  }
});