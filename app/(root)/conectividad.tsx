import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import CustomButton from '@/components/CustomButton';

// Define los botones fuera del componente para no recrearlos en cada render
const initialButtons = [
  {
    id: 1,
    title: 'Datos del ID',
    subtitle: 'Registra los datos correspondientes del ID.',
    ready: false,
  },
  {
    id: 2,
    title: 'Fotografías de Acceso',
    subtitle: 'Carga fotografías del acceso.',
    ready: false,
  },
  { id: 3, title: 'Fotografías del ID', subtitle: 'Carga fotografías del ID.', ready: false },
  {
    id: 4,
    title: 'Fotografías Empalme / TG',
    subtitle: 'Carga fotografías del empalme / TG.',
    ready: false,
  },
  {
    id: 5,
    title: 'Fotografías TDA y F',
    subtitle: 'Mediciones de voltage entre lineas / antes.',
    ready: false,
  },
  {
    id: 6,
    title: 'Fotografías TDA y F',
    subtitle: 'Mediciones de voltages de fase / antes.',
    ready: false,
  },
  {
    id: 7,
    title: 'Fotografías TDA y F',
    subtitle: 'Mediciones de corrientes / antes.',
    ready: false,
  },
  {
    id: 8,
    title: 'Planta a intervenir',
    subtitle: 'Carga fotografías de la planta.',
    ready: false,
  },
  {
    id: 9,
    title: 'Registro de trabajos',
    subtitle: 'Carga fotografías de Readecuación de PCC.',
    ready: false,
  },
  {
    id: 10,
    title: 'Registro de terminaciones',
    subtitle: 'Carga fotografías de Canalización, ruteo, etc.',
    ready: false,
  },
  {
    id: 11,
    title: 'Fotografías TDA y F',
    subtitle: 'Mediciones de voltages entre lineas / después.',
    ready: false,
  },
  {
    id: 12,
    title: 'Fotografías TDA y F',
    subtitle: 'Mediciones de voltages de fase / después.',
    ready: false,
  },
  {
    id: 13,
    title: 'Fotografías TDA y F',
    subtitle: 'Mediciones de corrientes / después.',
    ready: false,
  },
  {
    id: 14,
    title: 'Planta intervenida',
    subtitle: 'Carga fotografías de la planta.',
    ready: false,
  },
];

// Indicador de estado (listo/pendiente)
const RightIndicator = ({ ready }) => (
  <View
    style={{
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 8,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      backgroundColor: ready ? '#22c55e' : '#f97316', // Verde o Naranja
    }}
  />
);

const RegistroEquipo = () => {
  // Un solo estado para todos los botones
  const [buttons, setButtons] = useState(initialButtons);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);

  // useEffect para verificar si todas las tareas están completas
  useEffect(() => {
    const allReady = buttons.every((button) => button.ready);
    setAllTasksCompleted(allReady);
  }, [buttons]); // Se ejecuta cada vez que el estado de los botones cambia

  // Función para cambiar el estado de un botón por su ID
  const handleToggleReady = (id) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) => (button.id === id ? { ...button, ready: !button.ready } : button))
    );
  };

  // Función para guardar y volver
  const handleSave = () => {
    // Lógica para guardar los datos (ej. enviar a una API)...

    // Navega de vuelta a Home y pasa el estado de completitud como parámetro
    router.push({ pathname: '/home', params: { conectividadCompleted: allTasksCompleted } });
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 50 }}>
      <View className="space-y-5 px-5 pt-5">
        {/* Mapea el array de botones para renderizarlos */}
        {buttons.map((button) => (
          <TouchableOpacity
            key={button.id}
            onPress={() => handleToggleReady(button.id)}
            className="relative mt-6 w-full rounded-lg bg-sky-50 p-5 shadow-md"
            style={{ paddingRight: 20 }}>
            <Text className="text-left font-JakartaBold text-xl text-sky-600">{button.title}</Text>
            <Text className="mt-1 text-sm text-gray-500">{button.subtitle}</Text>
            <RightIndicator ready={button.ready} />
          </TouchableOpacity>
        ))}

        {/* Botón Guardar */}
        <CustomButton
          title="Guardar y Volver"
          onPress={handleSave}
          className="mt-6"
          // Opcional: Deshabilitar el botón si no está todo completo
          // disabled={!allTasksCompleted}
        />
      </View>
    </ScrollView>
  );
};

export default RegistroEquipo;
