import { useEffect } from "react";
import { ably } from "@/lib/ably";

export const useRideStart = (rideId: string, onStart: () => void) => {
    useEffect(() => {
        if (!rideId) {
            console.warn("⚠️ [useRideStart] rideId no definido");
            return;
        }

        const channel = ably.channels.get(`ride-start:${rideId}`);
        const handler = (msg: any) => {
            console.log("📥 [useRideStart] Mensaje recibido en canal:", `ride-start:${rideId}`);
            console.log("📦 [useRideStart] Datos recibidos:", msg.data);

            if (msg.data?.status === "started") {
                console.log("✅ [useRideStart] Viaje iniciado");
                onStart();
            }
        };

        channel.subscribe("start", handler);
        console.log("✅ [useRideStart] Suscrito al canal:", `ride-start:${rideId}`);

        return () => {
            channel.unsubscribe("start", handler);
            console.log("👋 [useRideStart] Desuscrito del canal:", `ride-start:${rideId}`);
        };
    }, [rideId]);
};
