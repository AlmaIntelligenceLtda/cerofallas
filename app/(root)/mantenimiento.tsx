import { useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import InputField from "@/components/InputField";
import { useUser } from "@clerk/clerk-expo";
import { icons } from "@/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomButton from "@/components/CustomButton";

const checklistOptions = [
    { label: "Bueno", value: "1" },
    { label: "Regular", value: "2" },
    { label: "Malo", value: "3" },
    { label: "N/A", value: "4" }
];

const ChecklistItem = ({ label, selectedOption, onSelectOption, photoUri, onPickPhoto }) => (
    <View className="mb-6 w-full">
        <Text className="text-black mb-2 font-JakartaMedium">{label}</Text>
        <View className="flex-row gap-2 mb-2">
            {checklistOptions.map(({ label: optionLabel, value }) => (
                <TouchableOpacity
                    key={value}
                    onPress={() => onSelectOption(value)}
                    className={`flex-1 py-2 rounded-xl items-center ${selectedOption === value
                        ? "border-[#FFCD00] bg-yellow-300"
                        : "border border-gray-300 bg-general-800"
                        }`}
                >
                    <Text
                        className={`text-base font-JakartaMedium ${selectedOption === value ? "text-black" : "text-white"
                            }`}
                    >
                        {optionLabel}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity
            onPress={onPickPhoto}
            className="flex-row items-center gap-2 border border-gray-300 rounded-xl p-2 bg-general-800"
        >
            <Text className="text-white font-JakartaMedium">📷 Agregar foto</Text>
            {photoUri ? (
                <Image
                    source={{ uri: photoUri }}
                    style={{ width: 40, height: 40, borderRadius: 8 }}
                    resizeMode="cover"
                />
            ) : null}
        </TouchableOpacity>
    </View>
);

const ChecklistSection = () => {
    const { user } = useUser();

    const seguridadItems = [
        "Alarma retro", "Bluespot", "Baliza", "Bocina", "Cinturón", "Extintor", "Limpieza int.",
        "Espejos", "Licencia D", "Cédula de ID.", "Cuñas", "Cámara retro", "Puertas",
        "Equipos de radio", "Sensor retro", "DATE", "Códigos de error"
    ];

    const mecanicaItems = [
        "Frenos / parqueo", "Huellas neumáticos", "Fugas presentes", "Niveles", "Engrase",
        "Inflado neumático", "Estado luces", "Pernos rueda", "Parabrisas", "Limpia parabrisas",
        "Pasamanos", "Escalera", "Daño estructura", "Asiento", "A/C y calefacción", "Aditamiento"
    ];

    const [formData, setFormData] = useState<Record<string, string>>({});
    const [photos, setPhotos] = useState<Record<string, string | null>>({});

    const handleChange = (field: string, option: string) => {
        setFormData((prev) => ({ ...prev, [field]: option }));
    };

    const pickImage = async (label: string) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permiso para acceder a las fotos es requerido.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            allowsEditing: true
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setPhotos((prev) => ({ ...prev, [label]: uri }));
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAwareScrollView
                    className="w-full px-5"
                    showsVerticalScrollIndicator={false}
                    extraScrollHeight={200}
                    enableOnAndroid
                >
                    {/* SEGURIDAD */}
                    <Text className="text-lg font-JakartaBold text-black mb-3 text-center">Seguridad</Text>
                    {seguridadItems.map((label) => (
                        <ChecklistItem
                            key={label}
                            label={label}
                            selectedOption={formData[label] || null}
                            onSelectOption={(option) => handleChange(label, option)}
                            photoUri={photos[label] || null}
                            onPickPhoto={() => pickImage(label)}
                        />
                    ))}

                    {/* MECÁNICA */}
                    <Text className="text-lg font-JakartaBold text-black mb-3 text-center">Mecánica</Text>
                    {mecanicaItems.map((label) => (
                        <ChecklistItem
                            key={label}
                            label={label}
                            selectedOption={formData[label] || null}
                            onSelectOption={(option) => handleChange(label, option)}
                            photoUri={photos[label] || null}
                            onPickPhoto={() => pickImage(label)}
                        />
                    ))}

                    {/* OBSERVACIONES */}
                    <Text className="text-lg font-JakartaBold text-black mb-3 text-center">Observaciones</Text>
                    <InputField
                        label="Observaciones generales"
                        placeholder="Escribe una observación"
                        icon={icons.note}
                        multiline
                        value={formData["observaciones"] || ""}
                        onChangeText={(text) => setFormData((prev) => ({ ...prev, observaciones: text }))}
                    />
                    {/* Botón Guardar */}
                    <CustomButton title="Guardar" className="mt-6" />
                    <View className="h-20" />
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ChecklistSection;
