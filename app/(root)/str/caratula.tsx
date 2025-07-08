import {
    View,
    Text,
    TextInput,
    ScrollView,
    Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";
import CustomButton from "@/components/CustomButton";
import { useSTRStore } from "@/store/strStore";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";

const Caratula = () => {
    const { user } = useUser();
    const { form_id } = useLocalSearchParams();

    const {
        caratula,
        setCaratula,
        setCaratulaCompleta,
    } = useSTRStore();

    const [progresoId, setProgresoId] = useState<number | null>(null);

    const handleChange = (key: keyof typeof caratula, value: string) => {
        setCaratula({ [key]: value });
    };

    const isCaratulaCompleta = () => {
        const camposObligatorios = [
            "siteId", "siteName", "direccion", "comuna", "region",
            "tipoSitio", "estructura", "altura", "latitudGps", "longitudGps",
            "latitudPorton", "longitudPorton", "nombreIc", "celularIc",
        ];
        return camposObligatorios.every((campo) => caratula[campo]?.trim());
    };

    const handleGuardar = async () => {
        if (!caratula.siteId || !caratula.siteName || !caratula.nombreIc) {
            Alert.alert("Completa los campos obligatorios.");
            return;
        }

        const completo = isCaratulaCompleta();
        setCaratulaCompleta(completo);

        if (!completo) {
            Alert.alert("Guardado como borrador", "Aún faltan campos obligatorios.");
            return;
        }

        try {
            const response = await fetchAPI("/(api)/str/caratula", {
                method: "POST",
                body: JSON.stringify({
                    userId: user?.id,
                    progresoId, // esto vincula el progreso al form real
                    ...caratula,
                }),
            });

            setCaratula({});
            setCaratulaCompleta(true);

            Alert.alert("Formulario guardado correctamente", "", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error) {
            console.error("Error al guardar carátula:", error);
            Alert.alert("Hubo un problema al guardar.");
        }
    };

    // ⚡ Cargar progreso guardado
    useEffect(() => {
        if (!user?.id || form_id !== "-1") return;

        const cargarProgreso = async () => {
            try {
                const result = await fetchAPI(
                    `/(api)/str/progreso/caratula-get?userId=${user.id}&formId=${form_id}`
                );

                if (result?.form_data) {
                    setCaratula(result.form_data);
                    if (result.id) setProgresoId(result.id);
                }
            } catch (error) {
                console.error("Error al cargar progreso guardado:", error);
            }
        };

        cargarProgreso();
    }, [user?.id, form_id]);

    // 🧠 Auto-guardado con debounce
    useEffect(() => {
        if (!user?.id || !caratula.siteName || !caratula.siteId) return;

        const saveProgress = debounce(async () => {
            try {
                const result = await fetchAPI("/(api)/str/progreso/caratula-progress", {
                    method: "POST",
                    body: JSON.stringify({
                        userId: user.id,
                        siteName: caratula.siteName,
                        formData: caratula,
                        progresoId, // manda el progresoId si ya lo tienes
                    }),
                });

                if (result?.id && !progresoId) {
                    setProgresoId(result.id);
                }
            } catch (error) {
                console.error("Error auto-guardando progreso:", error);
            }
        }, 1500);

        saveProgress();
        return () => saveProgress.cancel();
    }, [caratula, user?.id]);

    return (
        <ScrollView className="flex-1 bg-white px-5 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
            <Text className="text-2xl font-JakartaBold text-sky-700 mb-4 text-center">Formulario de Carátula</Text>

            <Text className="text-lg font-JakartaSemiBold text-sky-600 mb-2">Información del Sitio</Text>

            <Field label="Site ID" value={caratula.siteId} onChangeText={(v) => handleChange("siteId", v)} />
            <Field label="Site Name" value={caratula.siteName} onChangeText={(v) => handleChange("siteName", v)} />
            <Field label="Dirección" value={caratula.direccion} onChangeText={(v) => handleChange("direccion", v)} />
            <Field label="Comuna" value={caratula.comuna} onChangeText={(v) => handleChange("comuna", v)} />
            <Field label="Región" value={caratula.region} onChangeText={(v) => handleChange("region", v)} />
            <Field label="Tipo Sitio" value={caratula.tipoSitio} onChangeText={(v) => handleChange("tipoSitio", v)} />
            <Field label="Estructura" value={caratula.estructura} onChangeText={(v) => handleChange("estructura", v)} />
            <Field label="Altura (m)" value={caratula.altura} onChangeText={(v) => handleChange("altura", v)} keyboardType="numeric" />

            <Text className="text-lg font-JakartaSemiBold text-sky-600 mt-6 mb-2">Coordenadas GPS</Text>

            <Field label="Latitud GPS" value={caratula.latitudGps} onChangeText={(v) => handleChange("latitudGps", v)} />
            <Field label="Longitud GPS" value={caratula.longitudGps} onChangeText={(v) => handleChange("longitudGps", v)} />
            <Field label="Latitud Portón" value={caratula.latitudPorton} onChangeText={(v) => handleChange("latitudPorton", v)} />
            <Field label="Longitud Portón" value={caratula.longitudPorton} onChangeText={(v) => handleChange("longitudPorton", v)} />

            <Text className="text-lg font-JakartaSemiBold text-sky-600 mt-6 mb-2">Técnico Responsable</Text>

            <Field label="Nombre IC" value={caratula.nombreIc} onChangeText={(v) => handleChange("nombreIc", v)} />
            <Field label="Celular IC" value={caratula.celularIc} onChangeText={(v) => handleChange("celularIc", v)} keyboardType="phone-pad" />

            <Text className="text-lg font-JakartaSemiBold text-sky-600 mt-6 mb-2">Observaciones</Text>

            <TextInput
                multiline
                numberOfLines={4}
                placeholder="Escribe aquí cualquier detalle adicional del sitio..."
                value={caratula.observaciones}
                onChangeText={(v) => handleChange("observaciones", v)}
                className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-700"
            />

            <CustomButton title="Guardar carátula" className="mt-8" onPress={handleGuardar} />
        </ScrollView>
    );
};

const Field = ({
    label,
    value,
    onChangeText,
    keyboardType = "default",
}: {
    label: string;
    value: string;
    onChangeText: (val: string) => void;
    keyboardType?: "default" | "numeric" | "phone-pad" | "email-address";
}) => (
    <View className="mb-4">
        <Text className="text-base font-JakartaMedium text-gray-700 mb-1">{label}</Text>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            placeholder={`Ingresa ${label.toLowerCase()}`}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
        />
    </View>
);

export default Caratula;
