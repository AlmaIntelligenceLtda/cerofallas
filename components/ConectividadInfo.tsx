import { View, Text, TouchableOpacity } from 'react-native';

import Field from '@/components/Field'; // asegúrate de tener el archivo listo

export default function ConectividadInfo({ conectividad, onChange, onObtenerGPS }) {
  return (
    <View>
      <Text className="mb-4 text-center font-JakartaBold text-2xl text-sky-700">
        Formulario de conectividad
      </Text>

      <Text className="mb-2 font-JakartaSemiBold text-lg text-sky-600">Información del Sitio</Text>
      <Field
        label="Site ID"
        fieldKey="siteId"
        initialValue={conectividad.siteId || ''}
        onSave={onChange}
      />
      <Field
        label="Site Name"
        fieldKey="siteName"
        initialValue={conectividad.siteName || ''}
        onSave={onChange}
      />
      <Field
        label="Dirección"
        fieldKey="direccion"
        initialValue={conectividad.direccion || ''}
        onSave={onChange}
      />
      <Field
        label="Comuna"
        fieldKey="comuna"
        initialValue={conectividad.comuna || ''}
        onSave={onChange}
      />
      <Field
        label="Región"
        fieldKey="region"
        initialValue={conectividad.region || ''}
        onSave={onChange}
      />
      <Field
        label="Tipo Sitio"
        fieldKey="tipoSitio"
        initialValue={conectividad.tipoSitio || ''}
        onSave={onChange}
      />
      <Field
        label="Estructura"
        fieldKey="estructura"
        initialValue={conectividad.estructura || ''}
        onSave={onChange}
      />
      <Field
        label="Altura (m)"
        fieldKey="altura"
        initialValue={conectividad.altura || ''}
        onSave={onChange}
        keyboardType="numeric"
      />
      <Field
        label="Operadora"
        fieldKey="operadora"
        initialValue={conectividad.operadora || ''}
        onSave={onChange}
      />
      <Field
        label="Propietario de la Estructura"
        fieldKey="propietario_estructura"
        initialValue={conectividad.propietario_estructura || ''}
        onSave={onChange}
      />
      <Field
        label="Código dueño de la estructura"
        fieldKey="codigo_dueno_estructura"
        initialValue={conectividad.codigo_dueno_estructura || ''}
        onSave={onChange}
      />

      <Text className="mb-2 mt-6 font-JakartaSemiBold text-lg text-sky-600">Coordenadas GPS</Text>
      <Field
        label="Latitud GPS"
        fieldKey="latitudGps"
        initialValue={conectividad.latitudGps || ''}
        onSave={onChange}
      />
      <Field
        label="Longitud GPS"
        fieldKey="longitudGps"
        initialValue={conectividad.longitudGps || ''}
        onSave={onChange}
      />
      <TouchableOpacity
        onPress={() => onObtenerGPS('sitio')}
        className="mb-4 rounded-lg bg-blue-500 p-3">
        <Text className="text-center text-white">Obtener coordenadas del sitio</Text>
      </TouchableOpacity>

      <Field
        label="Latitud Portón"
        fieldKey="latitudPorton"
        initialValue={conectividad.latitudPorton || ''}
        onSave={onChange}
      />
      <Field
        label="Longitud Portón"
        fieldKey="longitudPorton"
        initialValue={conectividad.longitudPorton || ''}
        onSave={onChange}
      />
      <TouchableOpacity
        onPress={() => onObtenerGPS('porton')}
        className="mb-4 rounded-lg bg-blue-500 p-3">
        <Text className="text-center text-white">Obtener coordenadas del portón</Text>
      </TouchableOpacity>

      <Text className="mb-2 mt-6 font-JakartaSemiBold text-lg text-sky-600">
        Técnico Responsable
      </Text>
      <Field
        label="Nombre IC"
        fieldKey="nombreIc"
        initialValue={conectividad.nombreIc || ''}
        onSave={onChange}
      />
      <Field
        label="Celular IC"
        fieldKey="celularIc"
        initialValue={conectividad.celularIc || ''}
        onSave={onChange}
        keyboardType="phone-pad"
      />
    </View>
  );
}
