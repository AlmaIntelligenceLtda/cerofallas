import { ably } from "@/lib/ably";
import { RideRequest } from "@/types/ride";

export const useRideDispatch = () => {
    const sendRideRequest = async (payload: RideRequest) => {
        try {
            const driverId = payload.toDriverIds[payload.currentIndex];

            if (!driverId) {
                console.warn("❌ [useRideDispatch] driverId no encontrado en el índice actual:", payload.currentIndex);
                return;
            }

            const channel = ably.channels.get(`ride-request:${driverId}`);

            console.log("📤 [useRideDispatch] Enviando solicitud a:", driverId);
            console.log("📦 [useRideDispatch] Payload completo:", payload);

            await channel.publish('request', payload);

            console.log("✅ [useRideDispatch] Solicitud publicada en canal ride-request:" + driverId);
        } catch (error) {
            console.error("❌ [useRideDispatch] Error al publicar solicitud:", error);
        }
    };

    return { sendRideRequest };
};
