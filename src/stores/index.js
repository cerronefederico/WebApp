// src/stores/index.js

import { createPlcStore } from './plcStore';

// Le tre istanze globali:
export const usePlc1Store = createPlcStore('plc1');
export const usePlc2Store = createPlcStore('plc2');
export const usePlc3Store = createPlcStore('plc3');

// Esporta tutti gli store in modo da poterli importare facilmente in WebSocketStore
export const allPlcStoresHooks = {
    plc1: usePlc1Store,
    plc2: usePlc2Store,
    plc3: usePlc3Store,
};