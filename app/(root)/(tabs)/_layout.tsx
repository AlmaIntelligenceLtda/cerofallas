import { Tabs } from "expo-router";
import { icons } from "@/constants";
import { Image } from "react-native";

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "#3da0e2", // Íconos morados cuando están activos
        tabBarInactiveTintColor: "gray", // Íconos grises cuando no están activos
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={icons.home}
              style={{ tintColor: color, width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="documentos"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={icons.list}
              style={{ tintColor: color, width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pendientes"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={icons.chat}
              style={{ tintColor: color, width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={icons.profile}
              style={{ tintColor: color, width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
