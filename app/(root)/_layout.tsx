import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="conectividad/registro-conectividad"
        options={{ headerShown: true, title: 'PCC a TDA y F' }}
      />
      <Stack.Screen
        name="str/index"
        options={{ headerShown: true, title: 'Site Technical Report' }}
      />
      <Stack.Screen
        name="mantenimiento/registro-mantenimiento"
        options={{ headerShown: true, title: 'Mantenimiento' }}
      />

      {/* Subpantallas opcionales */}
      <Stack.Screen name="str/caratula" options={{ title: 'Carátula STR' }} />
      <Stack.Screen name="str/checklist" options={{ title: 'Checklist STR' }} />
      <Stack.Screen name="str/fotografico" options={{ title: 'Fotográfico ECE y BB' }} />
    </Stack>
  );
};

export default Layout;
