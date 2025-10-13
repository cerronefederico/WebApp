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
                if (state.stati[0].aanomaliagenerica) { count++; }
                if (state.stati[0].amotorenastro) { count++; }
                if (state.stati[0].amancanzaconsenso) { count++; }
                if (state.stati[0].atemperaturaprodottoalta) { count++; }
                if (state.stati[0].aemergenzainserita) { count++; }
                if (state.stati[0].atemperaturacpuelevata) { count++; }
                if (state.stati[0].aaggraffatricespenta) { count++; }
                if (state.stati[0].anastrospento) { count++; }
                return count;
            },
            getNumeroWarning: (state) => {
                let count = 0;
                if (state.stati[0].wtermico) { count++; }
                if (state.stati[0].wanomalianastro) { count++; }
                if (state.stati[0].wmancanzaprodotto) { count++; }
                if (state.stati[0].wpieno) { count++; }
                if (state.stati[0].wportelloneaperto) { count++; }
                return count;
            },
            getNotificaAllarmi: (state) => {
                return state.notifiche.filter((e) => {
                    return e.id.startsWith("a");
                })
            },
            getNotificaWarning: (state) => {
                return state.notifiche.filter((e) => {
                    return e.id.startsWith("w");
                })
            },
        }
    });
};