import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useDriverStore } from "@/store";
import { ActivityIndicator, View, Image } from "react-native";
import { images } from "@/constants";

const Index = () => {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  const setIsDriver = useDriverStore((state) => state.setIsDriver);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return; // 👈 aseguramos que Clerk haya terminado de cargar

    if (!isSignedIn) {
      setRedirectTo("/(auth)/welcome");
      return;
    }

    if (!user) return; // 👈 aseguramos que user esté definido

    const isDriverMeta = user.publicMetadata?.isDriver === true;

    setIsDriver(isDriverMeta);
    setRedirectTo(isDriverMeta ? "/(driver)/(tabs)/home" : "/(root)/(tabs)/home");
  }, [isLoaded, isSignedIn, user]);

  if (!redirectTo) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Image source={images.icon} className="w-28 h-28 mb-6" />
        <ActivityIndicator size="large" color="#852b96" />
      </View>
    );
  }

  return <Redirect href={redirectTo} />;
};

export default Index;
