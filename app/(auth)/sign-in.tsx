import { Image, ScrollView, Text, View } from 'react-native';

import OAuth from '@/components/OAuth';
import { images } from '@/constants';

const SignIn = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative h-[250px] w-full">
          <Image source={images.signUpCar} className="z-0 h-[250px] w-full" />
          <Text className="absolute bottom-5 left-5 font-JakartaSemiBold text-2xl text-black">
            Bienvenido 👋
          </Text>
        </View>

        <View className="p-5">
          <OAuth />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
