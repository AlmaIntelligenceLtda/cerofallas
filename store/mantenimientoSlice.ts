import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FotograficoData, MantenimientoData } from '@/types/mantenimiento';

interface MantenimientoState {
  fotografico: FotograficoData;
  mantenimiento: MantenimientoData;
  fotograficoCompleto: boolean;
  mantenimientoCompleto: boolean;
}

const initialFotografico: FotograficoData = {
  nombreSitio: '',
  codigoSitio: '',
  direccion: '',
  ciudad: '',
  region: '',
  idAcceso1: '',
  idAcceso2: '',
  numeroCrq: '',
  numeroIncidencia: '',
  empresaEjecutante: '',
  nombreTecnico: '',
  nombreSupervisor: '',
  fechaEjecucion: '',
  imagenes: [],
};

const initialMantenimiento: MantenimientoData = {
  nombreSitio: '',
  codigoSitio: '',
  direccion: '',
  ciudad: '',
  region: '',
  idAcceso1: '',
  idAcceso2: '',
  numeroCrq: '',
  numeroIncidencia: '',
  empresaEjecutante: '',
  nombreTecnico: '',
  nombreSupervisor: '',
  fechaEjecucion: '',
  tipoEquipo: '',
  marcaEquipo: '',
  numeroSerie: '',
  tipoMantenimiento: '',
  horometro: '',
  resumenTrabajo: '',
  adjuntaComprobante: '',
  cantidadHojas: '',
  observaciones: '', // 👈 nuevo campo agregado
};

const mantenimientoSlice = createSlice({
  name: 'mantenimiento',
  initialState: {
    fotografico: initialFotografico,
    mantenimiento: initialMantenimiento,
    fotograficoCompleto: false,
    mantenimientoCompleto: false,
  } as MantenimientoState,
  reducers: {
    setFotografico(state, action: PayloadAction<Partial<FotograficoData>>) {
      state.fotografico = { ...state.fotografico, ...action.payload };
    },
    setMantenimiento(state, action: PayloadAction<Partial<MantenimientoData>>) {
      state.mantenimiento = { ...state.mantenimiento, ...action.payload };
    },
    setFotograficoCompleto(state, action: PayloadAction<boolean>) {
      state.fotograficoCompleto = action.payload;
    },
    setMantenimientoCompleto(state, action: PayloadAction<boolean>) {
      state.mantenimientoCompleto = action.payload;
    },
    resetMantenimiento(state) {
      state.mantenimiento = initialMantenimiento;
      state.mantenimientoCompleto = false;
    },
    resetFotografico(state) {
      state.fotografico = initialFotografico;
      state.fotograficoCompleto = false;
    },
    resetTodo(state) {
      state.mantenimiento = initialMantenimiento;
      state.mantenimientoCompleto = false;
      state.fotografico = initialFotografico;
      state.fotograficoCompleto = false;
    },
  },
});

export const {
  setFotografico,
  setMantenimiento,
  setFotograficoCompleto,
  setMantenimientoCompleto,
  resetMantenimiento,
  resetFotografico,
  resetTodo,
} = mantenimientoSlice.actions;

export default mantenimientoSlice.reducer;
