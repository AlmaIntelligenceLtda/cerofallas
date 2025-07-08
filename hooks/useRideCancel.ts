import { useEffect } from "react";
import { ably } from "@/lib/ably";

export const useRideCancel = (rideId: string, onCancel: () => void) => {
    useEffect(() => {
        if (!rideId) {
            console.warn("⚠️ [useRideCancel] rideId no definido");
            return;
        }

        const channel = ably.channels.get(`ride-cancel:${rideId}`);
        const handler = (msg: any) => {
            console.log("📥 [useRideCancel] Solicitud de cancelación recibida en canal:", `ride-cancel:${rideId}`);
            console.log("📦 [useRideCancel] Datos recibidos:", msg.data);

            if (msg.data?.status === "canceled") {
                console.log("✅ [useRideCancel] Viaje cancelado");
                onCancel();
            }
        };

        channel.subscribe("cancel", handler);
        console.log("✅ [useRideCancel] Suscrito al canal:", `ride-cancel:${rideId}`);

        return () => {
            channel.unsubscribe("cancel", handler);
            console.log("👋 [useRideCancel] Desuscrito del canal:", `ride-cancel:${rideId}`);
        };
    }, [rideId]);
};
