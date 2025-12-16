export interface ImagenItem {
  uri: string;
  descripcion: string;
}

export interface FotograficoData {
  nombreSitio: string;
  codigoSitio: string;
  direccion: string;
  ciudad: string;
  region: string;
  idAcceso1: string;
  idAcceso2: string;
  numeroCrq: string;
  numeroIncidencia: string;
  empresaEjecutante: string;
  nombreTecnico: string;
  nombreSupervisor: string;
  fechaEjecucion: string;
  imagenes: ImagenItem[];
}

export interface MantenimientoData {
  nombreSitio: string;
  codigoSitio: string;
  direccion: string;
  ciudad: string;
  region: string;
  idAcceso1: string;
  idAcceso2: string;
  numeroCrq: string;
  numeroIncidencia: string;
  empresaEjecutante: string;
  nombreTecnico: string;
  nombreSupervisor: string;
  fechaEjecucion: string;
  tipoEquipo: string;
  marcaEquipo: string;
  numeroSerie: string;
  tipoMantenimiento: 'Preventivo' | 'Correctivo' | '';
  horometro: string;
  resumenTrabajo: string;
  adjuntaComprobante: 'Sí' | 'No' | '';
  cantidadHojas: string;
}
