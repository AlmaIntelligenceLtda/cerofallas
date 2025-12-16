import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ConectividadData } from '@/types/conectividad';

interface ConectividadState {
  conectividad: Partial<ConectividadData>;
  conectividadCompleto: boolean;
  resumenMedicionesAntes: Record<string, string>;
  resumenMedicionesDespues: Record<string, string>;
  form_id_pendiente: string | null;
}

const initialState: ConectividadState = {
  conectividad: {},
  conectividadCompleto: false,
  resumenMedicionesAntes: {},
  resumenMedicionesDespues: {},
  form_id_pendiente: null,
};

const conectividadSlice = createSlice({
  name: 'conectividad',
  initialState,
  reducers: {
    setConectividad(state, action: PayloadAction<Partial<ConectividadData>>) {
      state.conectividad = { ...state.conectividad, ...action.payload };
    },
    setConectividadCompleto(state, action: PayloadAction<boolean>) {
      state.conectividadCompleto = action.payload;
    },
    setResumenMediciones(
      state,
      action: PayloadAction<{ tipo: 'antes' | 'despues'; campo: string; valor: string }>
    ) {
      const { tipo, campo, valor } = action.payload;

      if (tipo === 'antes') {
        state.resumenMedicionesAntes = {
          ...state.resumenMedicionesAntes,
          [campo]: valor,
        };
      } else {
        state.resumenMedicionesDespues = {
          ...state.resumenMedicionesDespues,
          [campo]: valor,
        };
      }
    },
    setFormIdPendiente(state, action: PayloadAction<string | null>) {
      state.form_id_pendiente = action.payload;
    },
    resetConectividad(state) {
      state.conectividad = {};
      state.resumenMedicionesAntes = {};
      state.resumenMedicionesDespues = {};
      state.form_id_pendiente = null;
      // ❗NO reiniciamos conectividadCompleto para mantenerlo en true tras guardar
    },
  },
});

export const {
  setConectividad,
  setConectividadCompleto,
  setResumenMediciones,
  setFormIdPendiente,
  resetConectividad, // ✅ acción nueva exportada
} = conectividadSlice.actions;

export default conectividadSlice.reducer;
