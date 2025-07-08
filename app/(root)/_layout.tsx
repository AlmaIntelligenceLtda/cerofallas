import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="conectividad/index"
        options={{ headerShown: true, title: "PCC a TDA y F" }}
      />
      <Stack.Screen
        name="str/index"
        options={{ headerShown: true, title: "Site Technical Report" }}
      />
      <Stack.Screen
        name="mantenimiento/index"
        options={{ headerShown: true, title: "Mantenimiento" }}
      />

      {/* Subpantallas opcionales */}
      <Stack.Screen
        name="str/caratula"
        options={{ title: "Carátula STR" }}
      />
      <Stack.Screen
        name="str/checklist"
        options={{ title: "Checklist STR" }}
      />
    </Stack>
  );
};

export default Layout;
