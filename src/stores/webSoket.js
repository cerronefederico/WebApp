// src/stores/websocketStore.js

import { defineStore } from 'pinia';
import { allPlcStoresHooks } from './index';

export const useWebSocketStore = defineStore('websocketConnection', {
  state: () => ({
    socket: null,
    isConnected: false,
    reconnectTimer: null,
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
                if (allPlcData[plcId].acceso !== undefined) {
                    plcStore.setAcceso(allPlcData[plcId].acceso);
                }
                if (allPlcData[plcId].blocco !== undefined) {
                    plcStore.setBlocco(allPlcData[plcId].blocco);
                }
                if (allPlcData[plcId].regime !== undefined) {
                    plcStore.setRegime(allPlcData[plcId].regime);
                }
                if (allPlcData[plcId].wTermico !== undefined) {
                    plcStore.setWTermico(allPlcData[plcId].wTermico);
                }
                if (allPlcData[plcId].wAnomaliaNastro !== undefined) {
                    plcStore.setWAnomaliaNastro(allPlcData[plcId].wAnomaliaNastro);
                }
                if (allPlcData[plcId].wMancanzaProdotto !== undefined) {
                    plcStore.setWMancanzaProdotto(allPlcData[plcId].wMancanzaProdotto);
                }
                if (allPlcData[plcId].wPieno !== undefined) {
                    plcStore.setWPieno(allPlcData[plcId].wPieno);
                }
                if (allPlcData[plcId].wPortelloneAperto !== undefined) {
                    plcStore.setWPortelloneAperto(allPlcData[plcId].wPortelloneAperto);
                }
                if (allPlcData[plcId].aAnomaliaGenerica !== undefined) {
                    plcStore.setAAnomaliaGenerica(allPlcData[plcId].aAnomaliaGenerica);
                }
                if (allPlcData[plcId].aMotoreNastro !== undefined) {
                    plcStore.setAMotoreNastro(allPlcData[plcId].aMotoreNastro);
                }
                if (allPlcData[plcId].aMancanzaConsenso !== undefined) {
                    plcStore.setAMancanzaConsenso(allPlcData[plcId].aMancanzaConsenso);
                }
                if (allPlcData[plcId].aTemperaturaProdottoAlta !== undefined) {
                    plcStore.setATemperaturaProdottoAlta(allPlcData[plcId].aTemperaturaProdottoAlta);
                }
                if (allPlcData[plcId].aEmergenzaInserita !== undefined) {
                    plcStore.setAEmergenzaInserita(allPlcData[plcId].aEmergenzaInserita);
                }
                if (allPlcData[plcId].aTemperaturaCpuElevata !== undefined) {
                    plcStore.setATemperaturaCpuElevata(allPlcData[plcId].aTemperaturaCpuElevata);
                }
                if (allPlcData[plcId].aAggraffatriceSpenta !== undefined) {
                    plcStore.setAAggraffatriceSpenta(allPlcData[plcId].aAggraffatriceSpenta);
                }
                if (allPlcData[plcId].aNastroSpento !== undefined) {
                    plcStore.setANastroSpento(allPlcData[plcId].aNastroSpento);
                }
                if (allPlcData[plcId].contatorePezziTotale !== undefined) {
                    plcStore.setContatorePezziTotale(allPlcData[plcId].contatorePezziTotale);
                }
                if (allPlcData[plcId].contatorePezziParziale !== undefined) {
                    plcStore.setContatorePezziParziale(allPlcData[plcId].contatorePezziParziale);
                }
                if (allPlcData[plcId].contatorePezziParzialeBackup !== undefined) {
                    plcStore.setContatorePezziParzialeBackup(allPlcData[plcId].contatorePezziParzialeBackup);
                }
                if (allPlcData[plcId].velocitaProduzionePezziMinuto !== undefined) {
                    plcStore.setVelocitaProduzionePezziMinuto(allPlcData[plcId].velocitaProduzionePezziMinuto);
                }
                if (allPlcData[plcId].temperaturaCpu !== undefined) {
                    plcStore.setTemperaturaCpu(allPlcData[plcId].temperaturaCpu);
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