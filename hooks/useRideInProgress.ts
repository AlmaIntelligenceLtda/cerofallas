import { useEffect } from "react";
import { ably } from "@/lib/ably";

export const useRideInProgress = (rideId: string, onUpdate: (status: string) => void) => {
    useEffect(() => {
        if (!rideId) {
            console.warn("⚠️ [useRideInProgress] rideId no definido");
            return;
        }

        const channel = ably.channels.get(`ride-progress:${rideId}`);
        const handler = (msg: any) => {
            console.log("📥 [useRideInProgress] Actualización recibida en canal:", `ride-progress:${rideId}`);
            console.log("📦 [useRideInProgress] Datos recibidos:", msg.data);

            if (msg.data?.status) {
                console.log("✅ [useRideInProgress] Actualización de estado:", msg.data.status);
                onUpdate(msg.data.status);
            }
        };

        channel.subscribe("progress", handler);
        console.log("✅ [useRideInProgress] Suscrito al canal:", `ride-progress:${rideId}`);

        return () => {
            channel.unsubscribe("progress", handler);
            console.log("👋 [useRideInProgress] Desuscrito del canal:", `ride-progress:${rideId}`);
        };
    }, [rideId]);
};
