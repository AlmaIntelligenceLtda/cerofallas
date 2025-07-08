import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CaratulaData, ChecklistData } from "@/types/str";

const zustandStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return await AsyncStorage.getItem(name);
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await AsyncStorage.setItem(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await AsyncStorage.removeItem(name);
    },
};

interface STRState {
    caratula: CaratulaData;
    checklist: ChecklistData;
    caratulaCompleta: boolean;
    checklistCompleta: boolean;
    setCaratula: (data: Partial<CaratulaData>) => void;
    setChecklist: (data: Partial<ChecklistData>) => void;
    setCaratulaCompleta: (estado: boolean) => void;
    setChecklistCompleta: (estado: boolean) => void;
}

const initialCaratula: CaratulaData = {
    siteId: "", siteName: "", direccion: "", comuna: "", region: "",
    estructura: "", tipoSitio: "", altura: "", latitudGps: "", longitudGps: "",
    latitudPorton: "", longitudPorton: "", nombreIc: "", celularIc: "", observaciones: "",
};

const initialChecklist: ChecklistData = {
    codigo: "", nombre: "", direccion: "", nombreProfesional: "", empresaAliada: "", fechaEjecucion: "",
    marcaRectificador: "", modeloRectificador: "", potenciaTotal: "", modulosInstalados: "", capacidadAmperes: "", recarga5: "",
    marcaGabinete: "", modeloGabinete: "", limpiezaGabinete: "", anclajeGabinete: "", climatizacion: "", llavesEntregadas: "",
    marcaBaterias: "", modeloBaterias: "", cantidadBancos: "", capacidadBanco: "", capacidadTotalBanco: "",
    limpieza: "OK", inspeccionBornes: "OK", aprieteTorque: "OK", voltajeFlote: "",
    voltajeBanco1: "", voltajeBanco2: "", voltajeBanco3: "", voltajeBanco4: "",
    pruebaRespaldo: "NA", conectividadMeteo: "OK", puestaServicio: "OK", observaciones: ""
};

export const useSTRStore = create<STRState>()(
    persist(
        (set) => ({
            caratula: initialCaratula,
            checklist: initialChecklist,
            caratulaCompleta: false,
            checklistCompleta: false,
            setCaratula: (data) => set((state) => ({ caratula: { ...state.caratula, ...data } })),
            setChecklist: (data) => set((state) => ({ checklist: { ...state.checklist, ...data } })),
            setCaratulaCompleta: (estado) => set({ caratulaCompleta: estado }),
            setChecklistCompleta: (estado) => set({ checklistCompleta: estado }),
        }),
        {
            name: "str-storage",
            storage: zustandStorage,
        }
    )
);
