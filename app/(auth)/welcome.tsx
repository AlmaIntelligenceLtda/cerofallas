import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '@/components/CustomButton';
import { onboarding } from '@/constants';

const Home = () => {
  const listRef = useRef<FlatList<any> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        onPress={() => {
          router.replace('/(auth)/sign-in');
        }}
        className="flex w-full items-end justify-end p-5">
        <Text className="text-md font-JakartaBold text-black">Saltar</Text>
      </TouchableOpacity>

      <FlatList
        ref={listRef}
        data={onboarding}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
          );
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View className="flex items-center justify-center p-5" style={{ width: 360 }}>
            <Image source={item.image} className="h-[300px] w-full" resizeMode="contain" />
            <View className="mt-10 flex w-full flex-row items-center justify-center">
              <Text className="mx-10 text-center text-3xl font-bold text-black">{item.title}</Text>
            </View>
            <Text className="text-md mx-10 mt-3 text-center font-JakartaSemiBold text-[#858585]">
              {item.description}
            </Text>
          </View>
        )}
      />

      <CustomButton
        title={isLastSlide ? 'Iniciar' : 'Siguiente'}
        onPress={() => {
          if (isLastSlide) {
            router.replace('/(auth)/sign-in');
            return;
          }
          const next = activeIndex + 1;
          if (listRef.current && typeof listRef.current.scrollToIndex === 'function') {
            listRef.current.scrollToIndex({ index: next, animated: true });
          }
        }}
        className="mb-5 mt-10 w-8/12"
      />
    </SafeAreaView>
  );
};

export default Home;
