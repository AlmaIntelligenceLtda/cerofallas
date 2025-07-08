import { useEffect } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useSTRStore } from "@/store/strStore";
import { useUser } from "@clerk/clerk-expo";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFetch } from "@/lib/fetch";

const RightIndicator = ({ ready }: { ready: boolean }) => (
    <View
        style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 8,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            backgroundColor: ready ? "green" : "orange",
        }}
    />
);

const Str = () => {
    const {
        caratulaCompleta,
        checklistCompleta,
        setCaratulaCompleta,
        setChecklistCompleta,
    } = useSTRStore();

    const { user } = useUser();

    const { data, loading, error } = useFetch(`/(api)/str/progreso/${user?.id}`);

    useEffect(() => {
        if (data) {
            setCaratulaCompleta(data.caratula === true);
            setChecklistCompleta(data.checklist === true);
        }
    }, [data]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1 px-5"
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="mt-6">
                    <TouchableOpacity
                        onPress={() => router.push("/str/caratula")}
                        className="bg-sky-50 rounded-lg shadow-md p-5 w-full relative"
                        style={{ paddingRight: 20 }}
                    >
                        <Text className="text-xl font-JakartaBold text-sky-600 text-left">
                            Carátula
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                            Genera el formulario correspondiente.
                        </Text>
                        <RightIndicator ready={caratulaCompleta} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/str/checklist")}
                        className="bg-sky-50 rounded-lg shadow-md p-5 w-full relative mt-6"
                        style={{ paddingRight: 20 }}
                    >
                        <Text className="text-xl font-JakartaBold text-sky-600 text-left">
                            Checklist
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                            Verifica el estado de los gabinetes y baterías. Agrega fotografías si es necesario.
                        </Text>
                        <RightIndicator ready={checklistCompleta} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Str;
