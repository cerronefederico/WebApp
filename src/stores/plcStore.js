import { defineStore } from 'pinia';

export const createPlcStore = (plcId) => {
    return defineStore(`${plcId}`, {
        state: () => ({
            stati: null,
            contatori: null,
            notifiche: null,
        }),
        actions: {
            setStati(valore) {
                this.stati = valore;
            },
            setContatori(valore) {
                this.contatori = valore;
            },
            setNotifiche(valore) {
                this.notifiche = valore;
            },
        },
        getters: {
            getStati: (state) => {
                return state.stati;
            },
            getContatori: (state) => {
               return state.contatori;
            },
            getNotifiche: (state) => {
                return state.notifiche;
            },
            getNumeroAllarmi: (state) => {
                let count = 0;
                if (state.stati.aanomaliagenerica) { count++; }
                if (state.stati.amotorenastro) { count++; }
                if (state.stati.amancanzaconsenso) { count++; }
                if (state.stati.atemperaturaprodottoalta) { count++; }
                if (state.stati.aemergenzainserita) { count++; }
                if (state.stati.atemperaturacpuelevata) { count++; }
                if (state.stati.aaggraffatricespenta) { count++; }
                if (state.stati.anastrospento) { count++; }
                return count;
            },
            getNumeroWarning: (state) => {
                let count = 0;
                if (state.wtermico) { count++; }
                if (state.wanomalianastro) { count++; }
                if (state.wmancanzaprodotto) { count++; }
                if (state.wpieno) { count++; }
                if (state.wportelloneaperto) { count++; }
                return count;
            }
        }
    });
};