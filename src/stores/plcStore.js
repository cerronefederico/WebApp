import { defineStore } from 'pinia';

export const createPlcStore = (plcId) => {
    return defineStore(`${plcId}`, {
        state: () => ({
            stati: null, // Inizialmente null
            contatori: null, // Inizialmente null
            notifiche: null, // Inizialmente null
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
            // Getter semplici (non causano il crash)
            getStati: (state) => {
                return state.stati || [];
            },
            getContatori: (state) => {
               return state.contatori || [];
            },
            getNotifiche: (state) => {
                return state.notifiche || [];
            },

            // --- INIZIO CORREZIONI CRITICHE ---

            getNumeroAllarmi: (state) => {
                // CONTROLLO CRITICO: Se 'stati' non è pronto o è vuoto, restituisce 0.
                if (!state.stati || state.stati.length === 0) {
                    return 0;
                }

                // Il resto del calcolo è ora sicuro perché stati[0] esiste.
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
                // CONTROLLO CRITICO: Se 'stati' non è pronto o è vuoto, restituisce 0.
                if (!state.stati || state.stati.length === 0) {
                    return 0;
                }

                // Il resto del calcolo è ora sicuro.
                let count = 0;
                if (state.stati[0].wtermico) { count++; }
                if (state.stati[0].wanomalianastro) { count++; }
                if (state.stati[0].wmancanzaprodotto) { count++; }
                if (state.stati[0].wpieno) { count++; }
                if (state.stati[0].wportelloneaperto) { count++; }
                return count;
            },
            getNotificaAllarmi: (state) => {
                // CONTROLLO CRITICO: Se 'notifiche' non è pronto, restituisce un array vuoto.
                if (!state.notifiche) {
                    return [];
                }

                return state.notifiche.filter((e) => {
                    return e.id.startsWith("a");
                })
            },
            getNotificaWarning: (state) => {
                // CONTROLLO CRITICO: Se 'notifiche' non è pronto, restituisce un array vuoto.
                if (!state.notifiche) {
                    return [];
                }

                return state.notifiche.filter((e) => {
                    return e.id.startsWith("w");
                })
            },
        }
    });
};