import { useEffect } from "react";
import { ably } from "@/lib/ably";

export const useRideComplete = (rideId: string, onComplete: () => void) => {
    useEffect(() => {
        if (!rideId) {
            console.warn("⚠️ [useRideComplete] rideId no definido");
            return;
        }

        const channel = ably.channels.get(`ride-complete:${rideId}`);
        const handler = (msg: any) => {
            console.log("📥 [useRideComplete] Confirmación de viaje completa recibida en canal:", `ride-complete:${rideId}`);
            console.log("📦 [useRideComplete] Datos recibidos:", msg.data);

            if (msg.data?.status === "completed") {
                console.log("✅ [useRideComplete] Viaje completado");
                onComplete();
            }
        };

        channel.subscribe("complete", handler);
        console.log("✅ [useRideComplete] Suscrito al canal:", `ride-complete:${rideId}`);

        return () => {
            channel.unsubscribe("complete", handler);
            console.log("👋 [useRideComplete] Desuscrito del canal:", `ride-complete:${rideId}`);
        };
    }, [rideId]);
};
