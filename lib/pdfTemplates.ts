export const generarHTMLCaratula = (data: any) => `
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 11px;
        color: #000;
        margin: 0;
        padding: 10px;
      }
      .header {
        background-color: #0d47a1;
        color: white;
        display: flex;
        align-items: center;
        padding: 8px 16px;
        margin-bottom: 10px;
      }
      .header img {
        height: 32px;
        margin-right: 10px;
      }
      .header h1 {
        flex: 1;
        text-align: center;
        font-size: 16px;
        margin: 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
      }
      td, th {
        border: 1px solid #ccc;
        padding: 8px 12px;
        vertical-align: top;
      }
      .label-dark {
        background-color: #3d434a;
        color: white;
        font-weight: bold;
        font-size: 10px;
        width: 25%;
      }
      .value {
        background-color: #ffffff;
        font-size: 11px;
      }
      .title-row {
        background-color: #e5e5e5;
        font-weight: bold;
        font-size: 11px;
        padding: 6px 12px;
        border: 1px solid #ccc;
      }
      .note-label {
        background-color: #3d434a;
        color: white;
        font-size: 10px;
        font-weight: bold;
        width: 30%;
        vertical-align: top;
      }
      .note-body {
        font-size: 11px;
        padding: 10px;
        border: 1px solid #ccc;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Claro.svg" />
      <img src="https://i.pinimg.com/474x/39/9e/1d/399e1d4e09d62499ad1fd0f849afe43e.jpg" />
      <h1>SITE TECHNICAL REPORT</h1>
    </div>

    <table>
      <tr>
        <td class="label-dark">ALIADO:</td>
        <td class="value">ICETEL</td>
        <td class="label-dark">FECHA:</td>
        <td class="value">${data.fecha}</td>
      </tr>
      <tr>
        <td class="label-dark">SITE ID:</td>
        <td class="value">${data.site_id}</td>
        <td class="label-dark">SITE NAME:</td>
        <td class="value">${data.site_name}</td>
      </tr>
      <tr>
        <td class="label-dark">DIRECCIÓN:</td>
        <td class="value" colspan="3">${data.direccion}</td>
      </tr>
      <tr>
        <td class="label-dark">COMUNA:</td>
        <td class="value">${data.comuna}</td>
        <td class="label-dark">REGIÓN:</td>
        <td class="value">${data.region}</td>
      </tr>
      <tr>
        <td class="label-dark">TIPO SITIO:</td>
        <td class="value">${data.tipo_sitio}</td>
        <td class="label-dark">ESTRUCTURA:</td>
        <td class="value">${data.estructura}</td>
      </tr>
      <tr>
        <td class="label-dark">ALTURA:</td>
        <td class="value">${data.altura}</td>
        <td class="label-dark"></td>
        <td class="value"></td>
      </tr>
    </table>

    <table>
      <tr><td colspan="4" class="title-row">Coordenadas del Sitio (Decimales)<br>Colocar los Grados que informa el GPS:</td></tr>
      <tr>
        <td class="label-dark">LATITUD:</td>
        <td class="value">${data.latitud_gps}</td>
        <td class="label-dark">LONGITUD:</td>
        <td class="value">${data.longitud_gps}</td>
      </tr>
      <tr><td colspan="4" class="title-row">Coordenadas del portón de acceso o inicio de camino hacia el sitio</td></tr>
      <tr>
        <td class="label-dark">LATITUD:</td>
        <td class="value">${data.latitud_porton}</td>
        <td class="label-dark">LONGITUD:</td>
        <td class="value">${data.longitud_porton}</td>
      </tr>
    </table>

    <table>
      <tr><td colspan="4" class="title-row">DATOS IC (ING. CAMPO CLARO)</td></tr>
      <tr>
        <td class="label-dark">NOMBRE:</td>
        <td class="value">${data.nombre_ic}</td>
        <td class="label-dark">CELULAR:</td>
        <td class="value">${data.celular_ic}</td>
      </tr>
    </table>

    <table>
      <tr>
        <td class="label-dark">REQUIERE 4x4:</td>
        <td class="value">${data.requiere_4x4}</td>
        <td class="label-dark">ANIMALES:</td>
        <td class="value">${data.animales}</td>
      </tr>
      <tr>
        <td class="label-dark">ANDAMIOS:</td>
        <td class="value">${data.andamios}</td>
        <td class="label-dark">GRÚA:</td>
        <td class="value">${data.grua}</td>
      </tr>
      <tr>
        <td class="label-dark">COLOCALIZADO:</td>
        <td class="value">${data.colocalizado}</td>
        <td class="label-dark">Carro Canasta:</td>
        <td class="value">${data.carro_canasta}</td>
      </tr>
      <tr>
        <td class="label-dark">APERTURA RADOMO:</td>
        <td class="value">${data.apertura_radomo}</td>
        <td class="label-dark">Operadora:</td>
        <td class="value">${data.operadora}</td>
      </tr>
      <tr>
        <td class="label-dark">Propietario de la Estructura:</td>
        <td class="value">${data.propietario_estructura}</td>
        <td class="label-dark">Código dueño de la estructura:</td>
        <td class="value">${data.codigo_dueno_estructura}</td>
      </tr>
    </table>

    <table>
      <tr>
        <td class="note-label">OBSERVACIONES SOBRE EL SITIO PARA REALIZAR TRABAJOS<br><small>(Maleza para instalar equipos, escalerillas bloqueadas, Situación insalubre para trabajar)</small></td>
        <td class="note-body">${data.observaciones || 'Sin observaciones registradas.'}</td>
      </tr>
    </table>
  </body>
</html>
`;

export const generarHTMLChecklist = (data: any) => `
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 11px;
        margin: 20px 30px;
        color: #000;
      }
      .header {
        display: flex;
        align-items: center;
        background-color: #c62828;
        color: white;
        padding: 6px 12px;
      }
      .header img {
        height: 28px;
        margin-right: 6px;
      }
      .header h1 {
        flex: 1;
        text-align: center;
        font-size: 14px;
        margin: 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
      }
      th {
        background-color: #d32f2f;
        color: white;
        text-align: left;
        padding: 6px;
        font-size: 12px;
      }
      td {
        border: 1px solid #ccc;
        padding: 4px 6px;
        vertical-align: top;
      }
      .label {
        background-color: #f0f0f0;
        font-size: 10px;
        width: 150px;
        white-space: nowrap;
      }
      .value {
        font-size: 11px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Claro.svg" />
      <img src="https://i.pinimg.com/474x/39/9e/1d/399e1d4e09d62499ad1fd0f849afe43e.jpg" />
      <h1>REVISION INSTALACIÓN DE GABINETES Y BATERÍAS</h1>
    </div>

    <table>
      <tr><th colspan="2">DATOS GENERALES SITIO</th></tr>
      <tr><td class="label">CÓDIGO</td><td class="value">${data.codigo}</td></tr>
      <tr><td class="label">NOMBRE</td><td class="value">${data.nombre}</td></tr>
      <tr><td class="label">DIRECCIÓN</td><td class="value">${data.direccion}</td></tr>
      <tr><td class="label">PROFESIONAL A CARGO</td><td class="value">${data.nombre_profesional}</td></tr>
      <tr><td class="label">EMPRESA ALIADA</td><td class="value">${data.empresa_aliada}</td></tr>
      <tr><td class="label">FECHA EJECUCIÓN</td><td class="value">${data.fecha_ejecucion}</td></tr>

      <tr><th colspan="2">RECTIFICADOR EXISTENTE</th></tr>
      <tr><td class="label">MARCA</td><td class="value">${data.marca_rectificador}</td></tr>
      <tr><td class="label">MODELO</td><td class="value">${data.modelo_rectificador}</td></tr>
      <tr><td class="label">POTENCIA TOTAL</td><td class="value">${data.potencia_total}</td></tr>
      <tr><td class="label">MÓDULOS INSTALADOS</td><td class="value">${data.modulos_instalados}</td></tr>
      <tr><td class="label">CAPACIDAD (A)</td><td class="value">${data.capacidad_amperes}</td></tr>
      <tr><td class="label">RECARGA 5%</td><td class="value">${data.recarga_5}</td></tr>

      <tr><th colspan="2">GABINETE</th></tr>
      <tr><td class="label">MARCA</td><td class="value">${data.marca_gabinete}</td></tr>
      <tr><td class="label">MODELO</td><td class="value">${data.modelo_gabinete}</td></tr>
      <tr><td class="label">LIMPIEZA</td><td class="value">${data.limpieza_gabinete}</td></tr>
      <tr><td class="label">ANCLAJE</td><td class="value">${data.anclaje_gabinete}</td></tr>
      <tr><td class="label">CLIMATIZACIÓN</td><td class="value">${data.climatizacion}</td></tr>
      <tr><td class="label">LLAVES ZONA</td><td class="value">${data.llaves_entregadas}</td></tr>

      <tr><th colspan="2">BATERÍAS 48 VDC</th></tr>
      <tr><td class="label">MARCA</td><td class="value">${data.marca_baterias}</td></tr>
      <tr><td class="label">MODELO</td><td class="value">${data.modelo_baterias}</td></tr>
      <tr><td class="label">CANT. BANCOS</td><td class="value">${data.cantidad_bancos}</td></tr>
      <tr><td class="label">CAP. BANCO</td><td class="value">${data.capacidad_banco}</td></tr>
      <tr><td class="label">CAP. TOTAL</td><td class="value">${data.capacidad_total_banco}</td></tr>
    </table>

    <table>
      <tr>
        <th style="width: 30%;">ITEM</th>
        <th style="width: 20%;">ESTADO</th>
        <th style="width: 50%;">OBSERVACIONES</th>
      </tr>
      ${data.check_items
        .map(
          (item: any) => `
        <tr>
          <td class="value">${item.tipo.replace(/([a-z])([A-Z])/g, '$1 $2')}</td>
          <td class="value">${item.estado}</td>
          <td class="value">${item.observacion}</td>
        </tr>
      `
        )
        .join('')}
      ${
        data.voltajes
          ?.map(
            (v: any) => `
        <tr>
          <td class="value">${v.tipo.replace(/([a-z])([A-Z])/g, '$1 $2')}</td>
          <td colspan="2" class="value">${v.valor} V</td>
        </tr>
      `
          )
          .join('') || ''
      }
    </table>

    <table>
      <tr><th colspan="2">OBSERVACIONES FINALES</th></tr>
      <tr><td colspan="2" class="value">${data.observaciones || 'Sin observaciones.'}</td></tr>
    </table>
  </body>
</html>
`;

export const generarHTMLFotografico = (item: any) => {
  // Definición de estados
  const estados = {
    1: 'Bueno',
    2: 'Regular',
    3: 'Malo',
    4: 'N/A',
  };

  // Definición de secciones con checklist e imágenes asociadas
  const secciones = [
    {
      titulo: 'FOTOGRAFIAS SITUACION EXISTENTE - TG / TGAUX / TDAF',
      checklist: [
        'BREAKER AC MEDIDOR',
        'BREAKER AC GENERAL',
        'BREAKER AC ALIMENTA PPC',
        'VOLTAJE [AC] R/S FASE 1 BREAKER GENERAL',
        'VOLTAJE [AC] S/T FASE 2 BREAKER GENERAL',
        'VOLTAJE [AC] T/R FASE 3 BREAKER GENERAL',
        'VOLTAJE [AC] R/NEUTRO FASE 1 BREAKER GENERAL',
        'VOLTAJE [AC] S/NEUTRO FASE 2 BREAKER GENERAL',
        'VOLTAJE [AC] T/NEUTRO FASE 3 BREAKER GENERAL',
        'CORRIENTE [AC] FASE 1 BREAKER GENERAL',
        'CORRIENTE [AC] FASE 2 BREAKER GENERAL',
        'CORRIENTE [AC] FASE 3 BREAKER GENERAL',
        'VOLTAJE [AC] R/ S FASE 1 BREAKER AC ALIMENTA PPC',
        'VOLTAJE [AC] R/ S FASE 2 BREAKER AC ALIMENTA PPC',
        'VOLTAJE [AC] R/ S FASE 3 BREAKER AC ALIMENTA PPC',
        'VOLTAJE [AC] R / NEUTRO FASE 1 BREAKER AC ALIMENTA PPC',
        'VOLTAJE [AC] R / NEUTRO FASE 2 BREAKER AC ALIMENTA PPC',
        'VOLTAJE [AC] R / NEUTRO FASE 3 BREAKER AC ALIMENTA PPC',
        'CORRIENTE [AC] FASE 1 BREAKER AC ALIMENTA PPC',
        'CORRIENTE [AC] FASE 2 BREAKER AC ALIMENTA PPC',
        'CORRIENTE [AC] FASE 3 BREAKER AC ALIMENTA PPC',
      ],
    },
    {
      titulo: 'FOTOS PCC EXISTENTE ELTEK, VERTIV, MTS, ETP, DELTA, FPRA/B, ZTE',
      checklist: [
        'VISTA ANTES GABINETE COMPLETA PCC',
        'VISTA ANTES PCC',
        'VISTA ANTES BRAKER CONEXIÓN BATERIAS',
        'VOLTAJE [VCC] ANTES PCC',
        'CORRIENTE [ACC] TOTAL ANTES PCC',
        'CORRIENTE [VCC] TOTAL BATERIAS ANTES PCC',
      ],
    },
    {
      titulo:
        'FOTOGRAFIAS SITUACION PROYECTADA/INSTALADA - INSTALACION DE GABINETE BATERIA HUAWEI MTS 9300 / ALPSOLARR MTS 9304A',
      checklist: [
        'CORRIENTE TOTAL ANTES PCC [VISTA COMPLETA]',
        'ANCLAJE DE GABINETE DE BATERIAS',
        'VISTA INTERIOR GABINETE INSTALADO',
        'VISTA DE BATERIA 1',
        'VISTA DE BATERIA 2',
        'VISTA DE BATERIA 3',
        'VISTA DE BATERIA 4',
        'VISTA GENERAL DE BATERIAS',
        'VISTA APRIETE CON LLAVE TORQUE / 4,0 -5,0 Nm',
        'VISTA DE BARRA NEGATIVA [ETIQUETADO]',
        'VISTA DE BARRA POSITIVA [ETIQUETADO]',
        'VISTA DE BARRA DE TIERRA [ETIQUETADO]',
        'VISTA RECORRIDO DE CABLES POSITIVO-NEGATIVO CON CONDUIT',
        'VISTA RECORRIDO DE CABLE CAM CON CONDUIT',
        'VISTA RECORRIDO DE CABLE POSITIVO-NEGATIVO A.A. CON CONDUIT',
        'VISTA SELLADO DE CONDUIT POSITIVO-NEGATIVO',
        'VISTA SELLADO DE CONDUIT CABLE CAM',
        'VISTA SELLADO DE CONDUIT CABLE ENERGIA A.A.',
        'VISTA CONEXIÓN DE CABLES POSITIVO-NEGATIVO A BREAKER PCC',
        'VISTA CONEXIÓN CABLE CAM EN PCC',
        'VISTA CONEXIÓN DE CABLE ENERGIA A.A. EN PCC',
        'VOLTAJE [VCC] BATERIA 1',
        'VOLTAJE [VCC] BATERIA 2',
        'VOLTAJE [VCC] BATERIA 3',
        'VOLTAJE [VCC] BATERIA 4',
        'VOLTAJE [VCC] TOTAL',
        'CORRIENTE [ACC] BATERIA 1',
        'CORRIENTE [ACC] BATERIA 2',
        'CORRIENTE [ACC] BATERIA 3',
        'CORRIENTE [ACC] BATERIA 4',
        'CORRIENTE [ACC] TOTAL',
        'NUMERO DE SERIE GABINETE',
        'NUMERO DE SERIA BATERIA 1',
        'NUMERO DE SERIA BATERIA 2',
        'NUMERO DE SERIA BATERIA 3',
        'NUMERO DE SERIA BATERIA 4',
        'VISTA COMPLETA GABINETE DE PCC',
        'VISTA PCC',
        'VISTA DE A.A. GABINETE BATERIA ENCENDIDO',
      ],
    },
    {
      titulo: 'PANTALLAS CONFIGURACION DE PCC HUAWEI / ELTEK / VERTIV / FPRA/B / DELTA / ETP',
      checklist: [
        'PANTALLA 1',
        'PANTALLA 2',
        'PANTALLA 3',
        'PANTALLA 4',
        'PANTALLA 5',
        'PANTALLA 6',
        'PANTALLA 7',
        'PANTALLA 8',
      ],
    },
  ];

  // Función para dividir en bloques de 9 fotos
  const dividirEnBloques = (array, size) => {
    const bloques = [];
    for (let i = 0; i < array.length; i += size) {
      bloques.push(array.slice(i, i + size));
    }
    return bloques;
  };

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
           <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            page-break-inside: avoid;
          }
          .page {
            page-break-before: always;
            padding: 20px;
          }
          .section-header {
            background-color: #007BFF;
            color: white;
            padding: 8px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .photo-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 10px;
          }
          .photo {
            padding: 8px;
            box-sizing: border-box;
            border: 2px solid #ddd;
            border-radius: 8px;
            text-align: center;
            background-color: #f4f4f4;
          }
          .photo img {
            width: 75%;  /* Reducción del tamaño de la imagen */
            height: auto;
            border-radius: 4px;
            object-fit: contain;
          }
          .photo p {
            margin-top: 6px;
            font-size: 12px;  /* Texto más pequeño */
            font-weight: bold;
          }
          .estado {
            font-size: 10px;  /* Texto más pequeño para el estado */
            color: #007BFF;
          }
          .observacion {
            margin-top: 20px;
            font-size: 14px;  /* Texto más pequeño para observaciones */
            font-weight: bold;
            color: #333;
          }
        </style>
      </head>
      <body>
        ${secciones
          .map((seccion) => {
            // Construimos array de fotos válidas (con imagen)
            const fotos = seccion.checklist
              .map((key) => {
                const fotoUrl = item.photos[key];
                const estado = item.form_data[key];
                const estadoTexto = estados[estado];

                if (!fotoUrl) return null;

                return `
                <div class="photo">
                  <p>${key}</p>
                  <img src="${fotoUrl}" alt="${key}" />
                  <p class="estado">${estadoTexto}</p>
                </div>
              `;
              })
              .filter(Boolean); // quitar los null

            // Dividimos las fotos en bloques de 9
            const bloques = dividirEnBloques(fotos, 9);

            // Renderizar cada bloque de 9 fotos
            return bloques
              .map(
                (bloqueHTML, index) => `
              <div class="page">
                ${index === 0 && seccion.titulo ? `<div class="section-header">${seccion.titulo}</div>` : ''}
                <div class="photo-container">
                  ${bloqueHTML.join('')}
                </div>
              </div>
            `
              )
              .join('');
          })
          .join('')}

        <div class="observacion">
          <p><strong>Observaciones:</strong> ${item.form_data?.observaciones ?? ''}</p>
        </div>
      </body>
    </html>
  `;
};

export const generarHTMLMantenimiento = (item: any) => {
  const fotos = item.photos || [];

  return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 11px;
          margin: 0;
          padding: 10px;
        }
        .header {
          background-color: #d40000;
          color: white;
          text-align: center;
          padding: 10px;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
        }
        td, th {
          border: 1px solid black;
          padding: 6px 10px;
          vertical-align: top;
        }
        .section-title {
          background-color: #d40000;
          color: white;
          font-weight: bold;
          text-align: left;
        }
        .campo-label {
          font-weight: bold;
          width: 25%;
        }
        .observacion {
          padding: 12px;
          font-size: 11px;
        }
        .foto-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .foto-item {
          width: 48%;
          border: 1px solid #000;
          margin-bottom: 12px;
        }
        .foto-item img {
          width: 100%;
          height: auto;
          display: block;
        }
        .foto-item-caption {
          padding: 5px;
          background-color: #eee;
          font-size: 10px;
          border-top: 1px solid #000;
        }
      </style>
    </head>
    <body>
      <div class="header">REGISTRO DE MANTENIMIENTO PREVENTIVO<br>PLATAFORMA ELECTROMECÁNICA</div>

      <table>
        <tr><td colspan="4" class="section-title">DATOS NODO</td></tr>
        <tr><td class="campo-label">NOMBRE SITIO:</td><td>${item.nombre_sitio}</td><td class="campo-label">CÓDIGO SITIO:</td><td>${item.codigo_sitio}</td></tr>
        <tr><td class="campo-label">DIRECCIÓN:</td><td colspan="3">${item.direccion}</td></tr>
        <tr><td class="campo-label">CIUDAD:</td><td>${item.ciudad}</td><td class="campo-label">REGIÓN:</td><td>${item.region}</td></tr>
        <tr><td class="campo-label">ID ACCESO 1:</td><td>${item.id_acceso1}</td><td class="campo-label">ID ACCESO 2:</td><td>${item.id_acceso2}</td></tr>
        <tr><td class="campo-label">N° CRQ:</td><td>${item.numero_crq}</td><td class="campo-label">N° INCIDENCIA:</td><td>${item.numero_incidencia}</td></tr>
        <tr><td class="campo-label">EMPRESA EJECUTANTE:</td><td>${item.empresa_ejecutante}</td><td class="campo-label">TÉCNICO:</td><td>${item.nombre_tecnico}</td></tr>
        <tr><td class="campo-label">SUPERVISOR:</td><td>${item.nombre_supervisor}</td><td class="campo-label">FECHA EJECUCIÓN:</td><td>${item.fecha_ejecucion}</td></tr>
      </table>

      <table>
        <tr><td colspan="4" class="section-title">DATOS EQUIPO</td></tr>
        <tr><td class="campo-label">TIPO:</td><td>${item.tipo_equipo}</td><td class="campo-label">MARCA:</td><td>${item.marca_equipo}</td></tr>
        <tr><td class="campo-label">N° SERIE:</td><td>${item.numero_serie}</td><td class="campo-label">TIPO MANTENIMIENTO:</td><td>${item.tipo_mantenimiento}</td></tr>
        <tr><td class="campo-label">HORÓMETRO:</td><td colspan="3">${item.horometro}</td></tr>
      </table>

      <table>
        <tr><td colspan="4" class="section-title">RESUMEN DEL TRABAJO</td></tr>
        <tr><td colspan="4" class="observacion">${item.resumen_trabajo}</td></tr>
      </table>

      <table>
        <tr><td class="campo-label">ADJUNTA COMPROBANTE:</td><td>${item.adjunta_comprobante}</td><td class="campo-label">CANTIDAD DE HOJAS:</td><td>${item.cantidad_hojas}</td></tr>
      </table>

      <div class="section-title">REGISTRO FOTOGRÁFICO</div>
      <div class="foto-grid">
        ${fotos
          .map(
            (f) => `
          <div class="foto-item">
            <img src="${f.uri}" />
            <div class="foto-item-caption"><strong>${f.campo}</strong><br/>${f.descripcion}</div>
          </div>
        `
          )
          .join('')}
      </div>
    </body>
  </html>`;
};

interface Foto {
  uri: string;
  campo: string;
}

interface DocumentoConectividad {
  fecha: string;
  region: string;
  comuna: string;
  direccion: string;
  site_id: string;
  site_name: string;
  tipo_sitio: string;
  estructura: string;
  altura: string;
  operadora: string;
  propietario_estructura: string;
  codigo_dueno_estructura: string;
  nombre_ic: string;
  celular_ic: string;
  latitud_gps: string;
  longitud_gps: string;
  latitud_porton: string;
  longitud_porton: string;
  requiere4x4: string;
  animales: string;
  andamios: string;
  grua: string;
  carro_canasta: string;
  colocalizado: string;
  apertura_radomo: string;
  observaciones: string;
  fotos: Record<string, Foto[]>;
  resumen_mediciones_antes: Record<string, string>;
  resumen_mediciones_despues: Record<string, string>;
}

const MAX_PAGE_CHAR_LENGTH = 2150;
const HEADER_HEIGHT = 80;
const FOOTER_HEIGHT = 60;

export const generarHTMLConectividad = (item: DocumentoConectividad): string => {
  const baseUrl = 'http://165.227.14.82/uploads';

  const separarFotos = (fotos: Record<string, Foto[]>) => ({
    antes: Object.entries(fotos)
      .filter(([k]) => k.includes('antes'))
      .flatMap(([, arr]) => arr),
    despues: Object.entries(fotos)
      .filter(([k]) => k.includes('despues'))
      .flatMap(([, arr]) => arr),
    generales: Object.entries(fotos)
      .filter(([k]) => !k.includes('antes') && !k.includes('despues'))
      .flatMap(([, arr]) => arr),
  });

  const chunkArray = <T>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const {
    antes: fotosAntes,
    despues: fotosDespues,
    generales: fotosGenerales,
  } = separarFotos(item.fotos || {});

  const renderTablaResumen = (resumen: Record<string, string>) =>
    `<table>${Object.entries(resumen)
      .filter(([k]) => k.trim())
      .map(([k, v]) => `<tr><td class="campo-label">${k}:</td><td>${v}</td></tr>`)
      .join('')}</table>`;

  const renderFotos = (fotos: Foto[], titulo: string) => {
    if (fotos.length === 0) return '';

    const filas = chunkArray(fotos, 2)
      .map((row) => {
        const [f1, f2] = row;
        return `
      <div class="foto-row">
        <div class="foto-item">
          <img src="${f1.uri}" />
          <div class="foto-item-caption"><strong>${f1.campo}</strong></div>
        </div>
        ${
          f2
            ? `<div class="foto-item">
                <img src="${f2.uri}" />
                <div class="foto-item-caption"><strong>${f2.campo}</strong></div>
              </div>`
            : `<div class="foto-item empty"></div>`
        }
      </div>`;
      })
      .join('');

    return `
    <div class="section-container">
      <div class="section-title">${titulo}</div>
      <div class="foto-grid">${filas}</div>
    </div>`;
  };

  const renderSeccion = (titulo: string, contenido: string) =>
    `<div class="section-container"><div class="section-title">${titulo}</div>${contenido}</div>`;

  const secciones = [
    renderSeccion(
      'DATOS GENERALES',
      `<table>
        <tr><td class="campo-label">FECHA:</td><td>${item.fecha}</td><td class="campo-label">REGIÓN:</td><td>${item.region}</td></tr>
        <tr><td class="campo-label">COMUNA:</td><td>${item.comuna}</td><td class="campo-label">DIRECCIÓN:</td><td>${item.direccion}</td></tr>
        <tr><td class="campo-label">SITE ID:</td><td>${item.site_id}</td><td class="campo-label">SITE NAME:</td><td>${item.site_name}</td></tr>
        <tr><td class="campo-label">TIPO SITIO:</td><td>${item.tipo_sitio}</td><td class="campo-label">ESTRUCTURA:</td><td>${item.estructura}</td></tr>
        <tr><td class="campo-label">ALTURA:</td><td>${item.altura}</td><td class="campo-label">OPERADORA:</td><td>${item.operadora}</td></tr>
        <tr><td class="campo-label">PROPIETARIO ESTRUCTURA:</td><td>${item.propietario_estructura}</td><td class="campo-label">CÓDIGO DUEÑO:</td><td>${item.codigo_dueno_estructura}</td></tr>
      </table>`
    ),
    renderSeccion(
      'DATOS INSTALADOR',
      `<table><tr><td class="campo-label">NOMBRE IC:</td><td>${item.nombre_ic}</td><td class="campo-label">CELULAR:</td><td>${item.celular_ic}</td></tr></table>`
    ),
    renderSeccion(
      'COORDENADAS GPS',
      `<table><tr><td class="campo-label">LATITUD GPS:</td><td>${item.latitud_gps}</td><td class="campo-label">LONGITUD GPS:</td><td>${item.longitud_gps}</td></tr>
       <tr><td class="campo-label">LATITUD PORTÓN:</td><td>${item.latitud_porton}</td><td class="campo-label">LONGITUD PORTÓN:</td><td>${item.longitud_porton}</td></tr></table>`
    ),
    renderSeccion(
      'CONDICIONES DE ACCESO',
      `<table>
        <tr><td class="campo-label">REQU. 4X4:</td><td>${item.requiere4x4}</td><td class="campo-label">ANIMALES:</td><td>${item.animales}</td></tr>
        <tr><td class="campo-label">ANDAMIOS:</td><td>${item.andamios}</td><td class="campo-label">GRÚA:</td><td>${item.grua}</td></tr>
        <tr><td class="campo-label">CARRO CANASTA:</td><td>${item.carro_canasta}</td><td class="campo-label">COLOCALIZADO:</td><td>${item.colocalizado}</td></tr>
        <tr><td class="campo-label">APERTURA RADOMO:</td><td colspan="3">${item.apertura_radomo}</td></tr>
      </table>`
    ),
    renderSeccion(
      'OBSERVACIONES',
      `<div class="observacion">${item.observaciones || 'Sin observaciones'}</div>`
    ),
    renderFotos(fotosAntes, 'REGISTRO FOTOGRÁFICO – ANTES'),
    renderSeccion('RESUMEN MEDICIONES ANTES', renderTablaResumen(item.resumen_mediciones_antes)),
    renderFotos(fotosGenerales, 'REGISTRO FOTOGRÁFICO – GENERAL'),
    renderFotos(fotosDespues, 'REGISTRO FOTOGRÁFICO – DESPUÉS'),
    renderSeccion(
      'RESUMEN MEDICIONES DESPUÉS',
      renderTablaResumen(item.resumen_mediciones_despues)
    ),
  ];

  const createPage = (content: string) => `
    <div class="page">
      <div class="header"><img src="${baseUrl}/encabezado.png" /></div>
      <div class="content">${content}</div>
      <div class="footer"><img src="${baseUrl}/piedepagina.png" /></div>
    </div>
  `;

  const pages: string[] = [];
  let buffer = '';

  for (const seccion of secciones) {
    if (buffer.length + seccion.length > MAX_PAGE_CHAR_LENGTH) {
      pages.push(createPage(buffer));
      buffer = seccion;
    } else {
      buffer += seccion;
    }
  }

  if (buffer) pages.push(createPage(buffer));

  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <style>
        @page {
          size: A4;
          margin: 0;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          font-size: 11px;
        }

        .portada {
          height: 100vh;
          page-break-after: always;
        }

        .portada img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .page {
          page-break-after: always;
          position: relative;
          height: 100vh;
        }

        .header, .footer {
          position: absolute;
          left: 0;
          right: 0;
        }

        .header {
          top: 0;
          height: ${HEADER_HEIGHT}px;
        }

        .footer {
          bottom: 0;
          height: ${FOOTER_HEIGHT}px;
        }

        .header img, .footer img {
          width: 100%;
          height: 100%;
        }

        .content {
          position: absolute;
          top: ${HEADER_HEIGHT}px;
          bottom: ${FOOTER_HEIGHT}px;
          padding: 20px 40px;
          overflow: hidden;
        }

        .section-container {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }

        .section-title {
          background-color: #d40000;
          color: white;
          padding: 6px 10px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }

        td, th {
          border: 1px solid black;
          padding: 5px 10px;
          vertical-align: top;
        }

        .campo-label {
          font-weight: bold;
          width: 35%;
        }

        .observacion {
          padding: 10px;
          background: #f9f9f9;
          border: 1px solid #ddd;
        }

        .foto-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .foto-row {
          display: flex;
          gap: 10px;
          page-break-inside: avoid;
        }

        .foto-item {
          flex: 1;
          border: 1px solid #000;
        }

        .foto-item img {
          width: 100%;
          display: block;
        }

        .foto-item-caption {
          background: #eee;
          font-size: 10px;
          padding: 5px;
          border-top: 1px solid #000;
        }
      </style>
    </head>
    <body>
      <div class="portada"><img src="${baseUrl}/portada.jpg" /></div>
      ${pages.join('')}
    </body>
  </html>`;
};
