import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const siNoCampos = [
  'requiere4x4',
  'animales',
  'andamios',
  'grua',
  'colocalizado',
  'carroCanasta',
  'aperturaRadomo',
];

const initialCaratula = {
  siteId: '',
  siteName: '',
  direccion: '',
  comuna: '',
  region: '',
  estructura: '',
  tipoSitio: '',
  altura: '',
  latitudGps: '',
  longitudGps: '',
  latitudPorton: '',
  longitudPorton: '',
  nombreIc: '',
  celularIc: '',
  observaciones: '',
};

const initialChecklist = {
  codigo: '',
  nombre: '',
  direccion: '',
  nombreProfesional: '',
  empresaAliada: '',
  fechaEjecucion: '',
  marcaRectificador: '',
  modeloRectificador: '',
  potenciaTotal: '',
  modulosInstalados: '',
  capacidadAmperes: '',
  recarga5: '',
  marcaGabinete: '',
  modeloGabinete: '',
  limpiezaGabinete: '',
  anclajeGabinete: '',
  climatizacion: '',
  llavesEntregadas: '',
  marcaBaterias: '',
  modeloBaterias: '',
  cantidadBancos: '',
  capacidadBanco: '',
  capacidadTotalBanco: '',
  limpieza: 'OK',
  inspeccionBornes: 'OK',
  aprieteTorque: 'OK',
  voltajeFlote: '',
  voltajeBanco1: '',
  voltajeBanco2: '',
  voltajeBanco3: '',
  voltajeBanco4: '',
  pruebaRespaldo: 'NA',
  conectividadMeteo: 'OK',
  puestaServicio: 'OK',
  observaciones: '',
};

const initialFotografico = {
  observaciones: '',
  form_id_pendiente: null as string | null,
};

const initialState = {
  caratula: initialCaratula,
  checklist: initialChecklist,
  fotografico: initialFotografico,
  caratulaCompleta: false,
  checklistCompleta: false,
  fotograficoCompleto: false,
};

const strSlice = createSlice({
  name: 'str',
  initialState,
  reducers: {
    setCaratula(state, action: PayloadAction<Partial<typeof initialCaratula>>) {
      state.caratula = { ...state.caratula, ...action.payload };
    },
    setChecklist(state, action: PayloadAction<Partial<typeof initialChecklist>>) {
      state.checklist = { ...state.checklist, ...action.payload };
    },
    setFotografico(state, action: PayloadAction<Partial<typeof initialFotografico>>) {
      state.fotografico = { ...state.fotografico, ...action.payload };
    },
    setCaratulaCompleta(state, action: PayloadAction<boolean>) {
      state.caratulaCompleta = action.payload;
    },
    setChecklistCompleta(state, action: PayloadAction<boolean>) {
      state.checklistCompleta = action.payload;
    },
    setFotograficoCompleto(state, action: PayloadAction<boolean>) {
      state.fotograficoCompleto = action.payload;
    },
    setFormIdFotografico(state, action: PayloadAction<string | null>) {
      state.fotografico.form_id_pendiente = action.payload;
    },

    // 👇 NUEVOS: Resetean los formularios
    resetCaratula(state) {
      state.caratula = initialCaratula;
      state.caratulaCompleta = false;
    },
    resetChecklist(state) {
      state.checklist = initialChecklist;
      state.checklistCompleta = false;
    },
    resetFotografico(state) {
      state.fotografico = initialFotografico;
      state.fotograficoCompleto = false;
    },
  },
});

export const {
  setCaratula,
  setChecklist,
  setFotografico,
  setCaratulaCompleta,
  setChecklistCompleta,
  setFotograficoCompleto,
  setFormIdFotografico,
  resetCaratula,
  resetChecklist,
  resetFotografico,
} = strSlice.actions;

export default strSlice.reducer;
