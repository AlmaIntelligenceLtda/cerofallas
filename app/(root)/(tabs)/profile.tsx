import { useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDriverStore } from "@/store";

import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import WorkStatusCard from "@/components/WorkStatusCard";

const Profile = () => {
  const { user } = useUser();
  const router = useRouter();

  const isDriver = useDriverStore((state) => state.isDriver);
  const setIsDriver = useDriverStore((state) => state.setIsDriver);

  useEffect(() => {
    const isDriverMeta = user?.publicMetadata?.isDriver === true;
    setIsDriver(isDriverMeta);
  }, [user]);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl font-JakartaBold my-5">Mi perfil</Text>

        <View className="flex items-center justify-center my-5">
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3 mt-6">
          <View className="flex flex-col items-start justify-start w-full">
            <InputField
              label="Primer nombre"
              placeholder={user?.firstName || "No especifica"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Segundo nombre"
              placeholder={user?.lastName || "No especifica"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Rut"
              placeholder={
                user?.primaryEmailAddress?.emailAddress || "No especifica"
              }
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Teléfono"
              placeholder={
                user?.primaryPhoneNumber?.phoneNumber || "No especifica"
              }
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
