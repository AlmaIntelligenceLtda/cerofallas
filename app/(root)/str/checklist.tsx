import { useState, useRef, useMemo, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import CustomButton from "@/components/CustomButton";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router, useLocalSearchParams } from "expo-router";
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";
import { useSTRStore } from "@/store/strStore";
import debounce from "lodash.debounce";

const Checklist = () => {
    const { checklist, setChecklist, setChecklistCompleta } = useSTRStore();
    const { form_id } = useLocalSearchParams();
    const { user } = useUser();

    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["60%"], []);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [sheetMode, setSheetMode] = useState<"check" | "voltaje">("check");

    const [newItem, setNewItem] = useState({ tipo: "", estado: "", observacion: "" });
    const [newVoltaje, setNewVoltaje] = useState({ tipo: "", valor: "" });

    const [progresoId, setProgresoId] = useState<number | null>(null);

    const camposObligatorios = [
        "codigo", "nombre", "direccion", "nombreProfesional", "empresaAliada", "fechaEjecucion",
        "marcaRectificador", "modeloRectificador", "potenciaTotal", "modulosInstalados", "capacidadAmperes", "recarga5",
        "marcaGabinete", "modeloGabinete", "limpiezaGabinete", "anclajeGabinete", "climatizacion", "llavesEntregadas",
        "marcaBaterias", "modeloBaterias", "cantidadBancos", "capacidadBanco", "capacidadTotalBanco",
        "limpieza", "inspeccionBornes", "aprieteTorque", "pruebaRespaldo", "conectividadMeteo", "puestaServicio",
        "observaciones"
    ];

    const textFields = [
        "codigo", "nombre", "direccion", "nombreProfesional", "empresaAliada", "fechaEjecucion",
        "marcaRectificador", "modeloRectificador", "potenciaTotal", "modulosInstalados", "capacidadAmperes", "recarga5",
        "marcaGabinete", "modeloGabinete", "limpiezaGabinete", "anclajeGabinete", "climatizacion", "llavesEntregadas",
        "marcaBaterias", "modeloBaterias", "cantidadBancos", "capacidadBanco", "capacidadTotalBanco", "observaciones"
    ];

    const openSheet = (mode: "check" | "voltaje") => {
        setSheetMode(mode);
        if (mode === "check") setNewItem({ tipo: "", estado: "", observacion: "" });
        else setNewVoltaje({ tipo: "", valor: "" });
        setBottomSheetVisible(true);
    };

    const handleChange = (field: string, value: string) => {
        setChecklist({ [field]: value });
    };

    const isChecklistCompleto = () => {
        const camposFaltantes = camposObligatorios.filter((campo) => {
            const valor = checklist[campo];
            if (typeof valor === "string") return valor.trim() === "";
            return valor === null || valor === undefined;
        });

        const faltanItems =
            (!Array.isArray(checklist.checkItems) || checklist.checkItems.length === 0) &&
            (!Array.isArray(checklist.voltajes) || checklist.voltajes.length === 0);

        return camposFaltantes.length === 0 && !faltanItems;
    };

    const handleGuardar = async () => {
        if (!checklist.codigo || !checklist.nombre || !checklist.nombreProfesional) {
            Alert.alert("Completa los campos obligatorios.");
            return;
        }

        const completo = isChecklistCompleto();
        setChecklistCompleta(completo);

        if (!completo) {
            const camposFaltantes = camposObligatorios.filter((campo) => {
                const valor = checklist[campo];
                if (typeof valor === "string") return valor.trim() === "";
                return valor === null || valor === undefined;
            });

            const faltanItems =
                (!checklist.checkItems?.length && !checklist.voltajes?.length);

            const mensaje = [
                ...camposFaltantes.map((c) => `• ${c.replace(/([A-Z])/g, " $1").trim()}`),
                ...(faltanItems ? ["• Al menos un ítem de checklist o voltaje"] : []),
            ].join("\n");

            Alert.alert("Guardado como borrador", `Faltan los siguientes campos:\n\n${mensaje}`);
            return;
        }

        try {
            await fetchAPI("/(api)/str/checklist", {
                method: "POST",
                body: JSON.stringify({
                    userId: user?.id,
                    progresoId,
                    ...checklist,
                }),
            });

            Alert.alert("Checklist guardado correctamente", "", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Hubo un problema al guardar el checklist.");
        }
    };

    const handleSaveItem = () => {
        if (!newItem.tipo || !newItem.estado) {
            Alert.alert("Selecciona tipo y estado antes de guardar.");
            return;
        }
        setChecklist({ checkItems: [...(checklist.checkItems || []), newItem] });
        setBottomSheetVisible(false);
    };

    const handleSaveVoltaje = () => {
        if (!newVoltaje.tipo || !newVoltaje.valor) {
            Alert.alert("Selecciona tipo y valor antes de guardar.");
            return;
        }
        setChecklist({ voltajes: [...(checklist.voltajes || []), newVoltaje] });
        setBottomSheetVisible(false);
    };

    // Auto-guardado
    useEffect(() => {
        if (!user?.id || !checklist.codigo || !checklist.nombre) return;

        const saveProgress = debounce(async () => {
            try {
                const result = await fetchAPI("/(api)/str/progreso/checklist-progress", {
                    method: "POST",
                    body: JSON.stringify({
                        userId: user.id,
                        titulo: checklist.nombre,
                        formData: checklist,
                        progresoId, // manda si ya tienes uno
                    }),
                });

                if (result?.id && !progresoId) {
                    setProgresoId(result.id); // ⬅️ guardar el ID de str_progreso
                }
            } catch (error) {
                console.error("Error auto-guardando progreso:", error);
            }
        }, 1500);

        saveProgress();
        return () => saveProgress.cancel();
    }, [checklist, user?.id]);

    // Cargar progreso si form_id === -1
    useEffect(() => {
        if (!user?.id || form_id !== "-1") return;

        const loadProgress = async () => {
            try {
                const data = await fetchAPI(`/(api)/str/progreso/checklist-get?userId=${user.id}&formId=${form_id}`);
                if (data?.form_data) setChecklist(data.form_data);
            } catch (error) {
                console.error("Error al cargar progreso del checklist:", error);
            }
        };

        loadProgress();
    }, [form_id, user?.id]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView className="flex-1 bg-white px-5 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
                <Text className="text-2xl font-JakartaBold text-sky-700 mb-4">Checklist Gabinetes y Baterías</Text>

                {textFields.map((field) => (
                    <View key={field} className="mb-4">
                        <Text className="text-base font-JakartaMedium text-gray-700 capitalize mb-1">
                            {field.replace(/([A-Z])/g, " $1").trim()}
                        </Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-2"
                            value={checklist[field]}
                            onChangeText={(v) => handleChange(field, v)}
                            placeholder={`Ingresa ${field}`}
                        />
                    </View>
                ))}

                {/* CHECK ITEMS */}
                <View className="flex-row justify-between items-center mb-4 mt-6">
                    <Text className="text-lg font-JakartaBold text-gray-700">Checklist</Text>
                    <TouchableOpacity onPress={() => openSheet("check")} className="bg-sky-600 px-4 py-2 rounded-lg">
                        <Text className="text-white text-sm">+ Agregar ítem</Text>
                    </TouchableOpacity>
                </View>

                {(checklist.checkItems || []).map((item, i) => (
                    <View key={i} className="border border-gray-300 rounded-lg p-3 mb-3">
                        <Text className="text-gray-800">🧾 <Text className="font-bold">{item.tipo}</Text></Text>
                        <Text>Estado: {item.estado}</Text>
                        <Text>Observación: {item.observacion}</Text>
                        <TouchableOpacity
                            className="mt-2 self-end"
                            onPress={() => setChecklist({
                                checkItems: checklist.checkItems.filter((_, idx) => idx !== i),
                            })}
                        >
                            <Text className="text-red-600 text-sm">🗑️ Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {/* VOLTAJES */}
                <View className="flex-row justify-between items-center mb-4 mt-6">
                    <Text className="text-lg font-JakartaBold text-gray-700">Voltajes</Text>
                    <TouchableOpacity onPress={() => openSheet("voltaje")} className="bg-sky-600 px-4 py-2 rounded-lg">
                        <Text className="text-white text-sm">+ Agregar voltaje</Text>
                    </TouchableOpacity>
                </View>

                {(checklist.voltajes || []).map((v, i) => (
                    <View key={i} className="border border-gray-300 rounded-lg p-3 mb-3">
                        <Text className="text-gray-800">🔌 <Text className="font-bold">{v.tipo}</Text></Text>
                        <Text>Valor: {v.valor}</Text>
                        <TouchableOpacity
                            className="mt-2 self-end"
                            onPress={() => setChecklist({
                                voltajes: checklist.voltajes.filter((_, idx) => idx !== i),
                            })}
                        >
                            <Text className="text-red-600 text-sm">🗑️ Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <CustomButton title="Guardar checklist" className="mt-6" onPress={handleGuardar} />
            </ScrollView>

            {/* Bottom Sheet */}
            {bottomSheetVisible && (
                <BottomSheet
                    ref={sheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    onClose={() => setBottomSheetVisible(false)}
                >
                    <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
                        {sheetMode === "check" ? (
                            <>
                                <Text className="text-lg font-JakartaBold mb-2">Tipo de revisión</Text>
                                {["limpieza", "inspeccionBornes", "aprieteTorque", "pruebaRespaldo", "conectividadMeteo", "puestaServicio"].map((tipo) => (
                                    <TouchableOpacity
                                        key={tipo}
                                        onPress={() => setNewItem((prev) => ({ ...prev, tipo }))}
                                        className={`p-3 rounded-lg mb-2 border ${newItem.tipo === tipo ? "border-sky-500 bg-sky-100" : "border-gray-300"}`}
                                    >
                                        <Text>{tipo.replace(/([A-Z])/g, " $1").trim()}</Text>
                                    </TouchableOpacity>
                                ))}

                                <Text className="text-lg font-JakartaBold mt-4 mb-2">Estado</Text>
                                {["OK", "NO", "NA"].map((estado) => (
                                    <TouchableOpacity
                                        key={estado}
                                        onPress={() => setNewItem((prev) => ({ ...prev, estado }))}
                                        className={`p-3 rounded-lg mb-2 border ${newItem.estado === estado ? "border-sky-500 bg-sky-100" : "border-gray-300"}`}
                                    >
                                        <Text className="text-center">{estado}</Text>
                                    </TouchableOpacity>
                                ))}

                                <Text className="text-lg font-JakartaBold mt-4 mb-2">Observación</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-2"
                                    placeholder="Escribe una observación"
                                    value={newItem.observacion}
                                    onChangeText={(v) => setNewItem((prev) => ({ ...prev, observacion: v }))}
                                />

                                <CustomButton title="Guardar ítem" className="mt-6" onPress={handleSaveItem} />
                            </>
                        ) : (
                            <>
                                <Text className="text-lg font-JakartaBold mb-2">Tipo de voltaje</Text>
                                {["voltajeFlote", "voltajeBanco1", "voltajeBanco2", "voltajeBanco3", "voltajeBanco4"].map((tipo) => (
                                    <TouchableOpacity
                                        key={tipo}
                                        onPress={() => setNewVoltaje((prev) => ({ ...prev, tipo }))}
                                        className={`p-3 rounded-lg mb-2 border ${newVoltaje.tipo === tipo ? "border-sky-500 bg-sky-100" : "border-gray-300"}`}
                                    >
                                        <Text>{tipo.replace(/([A-Z])/g, " $1").trim()}</Text>
                                    </TouchableOpacity>
                                ))}

                                <Text className="text-lg font-JakartaBold mt-4 mb-2">Valor</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-4 py-2"
                                    placeholder="Ej: 52.7"
                                    keyboardType="decimal-pad"
                                    value={newVoltaje.valor}
                                    onChangeText={(v) => setNewVoltaje((prev) => ({ ...prev, valor: v }))}
                                />

                                <CustomButton title="Guardar voltaje" className="mt-6" onPress={handleSaveVoltaje} />
                            </>
                        )}
                    </BottomSheetScrollView>
                </BottomSheet>
            )}
        </GestureHandlerRootView>
    );
};

export default Checklist;
