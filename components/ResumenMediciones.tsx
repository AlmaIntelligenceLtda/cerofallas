import { View, Text, TextInput } from 'react-native';

type Props = {
  tipo: 'antes' | 'despues';
  datos: Record<string, string>;
  onChange: (campo: string, valor: string) => void;
};

const campos = [
  'Clave cerco, Key-box',
  'Compañía Eléctrica',
  'Número de poste',
  'Poste Anterior',
  'Poste Posterior',
  'Número de medidor',
  'Tipo de Conexión',
  'Voltaje R-S',
  'Voltaje S-T',
  'Voltaje R-T',
  'Voltaje R-Neutro',
  'Voltaje S-Neutro',
  'Voltaje T-Neutro',
  'Voltaje Neutro (Ts) - Tierra Protección (Tp)',
  'Consumo Fase R',
  'Consumo Fase S',
  'Consumo Fase T',
];

export default function ResumenMediciones({ tipo, datos, onChange }: Props) {
  return (
    <View className="mb-8">
      <Text className="mb-4 text-xl font-bold text-sky-700">
        Resumen de Mediciones - {tipo === 'antes' ? 'Antes' : 'Después'}
      </Text>
      {campos.map((campo) => (
        <View key={`${tipo}-${campo}`} className="mb-3">
          <Text className="text-gray-700">{campo}</Text>
          <TextInput
            value={datos[campo] || ''}
            onChangeText={(v) => onChange(campo, v)}
            placeholder="Ingrese valor"
            className="mt-1 rounded-lg border border-gray-300 px-4 py-2"
          />
        </View>
      ))}
    </View>
  );
}
