import { defineStore } from 'pinia';

export const createPlcStore = (plcId) => {
    return defineStore(`${plcId}`, {
        state: () => ({
            acceso: null,
            blocco: null,
            regime: null,
            wTermico: null,
            wAnomaliaNastro: null,
            wMancanzaProdotto: null,
            wPieno: null,
            wPortelloneAperto: null,
            aAnomaliaGenerica: null,
            aMotoreNastro: null,
            aMancanzaConsenso: null,
            aTemperaturaProdottoAlta: null,
            aEmergenzaInserita: null,
            aTemperaturaCpuElevata: null,
            aAggraffatriceSpenta: null,
            aNastroSpento: null,
            contatorePezziTotale: null,
            contatorePezziParziale: null,
            contatorePezziParzialeBackup: null,
            velocitaProduzionePezziMinuto: null,
            temperaturaCpu: null,
        }),
        actions: {
            setAcceso(valore) {
                this.acceso = valore;
            },
            setBlocco(valore) {
                this.blocco = valore;
            },
            setRegime(valore) {
                this.regime = valore;
            },
            setWTermico(valore) {
                this.wTermico = valore;
            },
            setWAnomaliaNastro(valore) {
                this.wAnomaliaNastro = valore;
            },
            setWMancanzaProdotto(valore) {
                this.wMancanzaProdotto = valore;
            },
            setWPieno(valore) {
                this.wPieno = valore;
            },
            setWPortelloneAperto(valore) {
                this.wPortelloneAperto = valore;
            },
            setAAnomaliaGenerica(valore) {
                this.aAnomaliaGenerica = valore;
            },
            setAMotoreNastro(valore) {
                this.aMotoreNastro = valore;
            },
            setAMancanzaConsenso(valore) {
                this.aMancanzaConsenso = valore;
            },
            setATemperaturaProdottoAlta(valore) {
                this.aTemperaturaProdottoAlta = valore;
            },
            setAEmergenzaInserita(valore) {
                this.aEmergenzaInserita = valore;
            },
            setATemperaturaCpuElevata(valore) {
                this.aTemperaturaCpuElevata = valore;
            },
            setAAggraffatriceSpenta(valore) {
                this.aAggraffatriceSpenta = valore;
            },
            setANastroSpento(valore) {
                this.aNastroSpento = valore;
            },
            setContatorePezziTotale(valore) {
                this.contatorePezziTotale = valore;
            },
            setContatorePezziParziale(valore) {
                this.contatorePezziParziale = valore;
            },
            setContatorePezziParzialeBackup(valore) {
                this.contatorePezziParzialeBackup = valore;
            },
            setVelocitaProduzionePezziMinuto(valore) {
                this.velocitaProduzionePezziMinuto = valore;
            },
            setTemperaturaCpu(valore) {
                this.temperaturaCpu = valore;
            },
        },
        getters: {
            getAcceso: (state) => {
                return state.acceso !== null ? state.acceso : 'N/D';
            },
            getBlocco: (state) => {
                return state.blocco !== null ? state.blocco : 'N/D';
            },
            getRegime: (state) => {
                return state.regime !== null ? state.regime : 'N/D';
            },
            getWTermico: (state) => {
                return state.wTermico !== null ? state.wTermico : 'N/D';
            },
            getWAnomaliaNastro: (state) => {
                return state.wAnomaliaNastro !==null ? state.wAnomaliaNastro : 'N/D';
            },
            getWMancanzaProdotto: (state) => {
                return state.wMancanzaProdotto !== null ? state.wMancanzaProdotto : 'N/D';
            },
            getWPieno: (state) => {
                return state.wPieno !== null ? state.wPieno : 'N/D';
            },
            getWPortelloneAperto: (state) => {
                return state.wPortelloneAperto !== null ? state.wPortelloneAperto : 'N/D';
            },
            getAAnomaliaGenerica: (state) => {
                return state.aAnomaliaGenerica !== null ? state.aAnomaliaGenerica : 'N/D';
            },
            getAMotoreNastro: (state) => {
                return state.aMotoreNastro !== null ? state.aMotoreNastro : 'N/D';
            },
            getAMancanzaConsenso: (state) => {
                return state.aMancanzaConsenso !== null ? state.aMancanzaConsenso : 'N/D'
            },
            getATemperaturaProdottoAlta: (state) => {
                return state.aTemperaturaProdottoAlta !== null ? state.aTemperaturaProdottoAlta : 'N/D';
            },
            getAEmergenzaInserita: (state) => {
                return state.aEmergenzaInserita !== null ? state.aEmergenzaInserita : 'N/D';
            },
            getATemperaturaCpuElevata: (state) => {
                return state.aTemperaturaCpuElevata !== null ? state.aTemperaturaCpuElevata : 'N/D';
            },
            getAAggraffatriceSpenta: (state) => {
                return state.aAggraffatriceSpenta !== null ? state.aAggraffatriceSpenta : 'N/D';
            },
            getANastroSpento: (state) => {
                return state.aNastroSpento !== null ? state.aNastroSpento : 'N/D';
            },
            getContatorePezziTotale: (state) => {
                return state.contatorePezziTotale !== null ? state.contatorePezziTotale : 'N/D';
            },
            getContatorePezziParziale: (state) => {
                return state.contatorePezziParziale !== null ? state.contatorePezziParziale : 'N/D';
            },
            getContatorePezziParzialeBackup: (state) => {
                return state.contatorePezziParzialeBackup !== null ? state.contatorePezziParzialeBackup : 'N/D';
            },
            getVelocitaProduzionePezziMinuto: (state) => {
                return state.velocitaProduzionePezziMinuto !== null ? state.velocitaProduzionePezziMinuto : 'N/D';
            },
            getTemperaturaCpu: (state) =>{
                return state.temperaturaCpu !== null ? state.temperaturaCpu : 'N/D';
            },
            getNumeroAllarmi: (state) => {
                let count = 0;
                if (state.aAnomaliaGenerica) { count++; }
                if (state.aMotoreNastro) { count++; }
                if (state.aMancanzaConsenso) { count++; }
                if (state.aTemperaturaProdottoAlta) { count++; }
                if (state.aEmergenzaInserita) { count++; }
                if (state.aTemperaturaCpuElevata) { count++; }
                if (state.aAggraffatriceSpenta) { count++; }
                if (state.aNastroSpento) { count++; }
                return count;
            },
            getNumeroWarning: (state) => {
                let count = 0;
                if (state.wTermico) { count++; }
                if (state.wAnomaliaNastro) { count++; }
                if (state.wMancanzaProdotto) { count++; }
                if (state.wPieno) { count++; }
                if (state.wPortelloneAperto) { count++; }
                return count;
            }
        }
    });
};