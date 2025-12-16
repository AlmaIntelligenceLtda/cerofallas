export interface CaratulaData {
  siteId: string;
  siteName: string;
  direccion: string;
  comuna: string;
  region: string;
  estructura: string;
  tipoSitio: string;
  altura: string;
  latitudGps: string;
  longitudGps: string;
  latitudPorton: string;
  longitudPorton: string;
  nombreIc: string;
  celularIc: string;
  observaciones: string;
}

export interface ChecklistData {
  codigo: string;
  nombre: string;
  direccion: string;
  nombreProfesional: string;
  empresaAliada: string;
  fechaEjecucion: string;

  marcaRectificador: string;
  modeloRectificador: string;
  potenciaTotal: string;
  modulosInstalados: string;
  capacidadAmperes: string;
  recarga5: string;

  marcaGabinete: string;
  modeloGabinete: string;
  limpiezaGabinete: string;
  anclajeGabinete: string;
  climatizacion: string;
  llavesEntregadas: string;

  marcaBaterias: string;
  modeloBaterias: string;
  cantidadBancos: string;
  capacidadBanco: string;
  capacidadTotalBanco: string;

  limpieza: string;
  inspeccionBornes: string;
  aprieteTorque: string;
  voltajeFlote: string;
  voltajeBanco1: string;
  voltajeBanco2: string;
  voltajeBanco3: string;
  voltajeBanco4: string;
  pruebaRespaldo: string;
  conectividadMeteo: string;
  puestaServicio: string;
  observaciones: string;

  /** Campos opcionales para frontend */
  checkItems?: { tipo: string; estado: string; observacion: string }[];
  voltajes?: { tipo: string; valor: string }[];
}
