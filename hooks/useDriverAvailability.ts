import { useEffect } from "react";
import { ably } from "@/lib/ably";

export const useDriverAvailability = (driverId: string, onUpdate: (available: boolean) => void) => {
    useEffect(() => {
        if (!driverId) {
            console.warn("⚠️ [useDriverAvailability] driverId no definido");
            return;
        }

        const channel = ably.channels.get(`driver-availability:${driverId}`);
        const handler = (msg: any) => {
            console.log("📥 [useDriverAvailability] Estado de disponibilidad recibido en canal:", `driver-availability:${driverId}`);
            console.log("📦 [useDriverAvailability] Datos recibidos:", msg.data);

            if (msg.data?.available !== undefined) {
                console.log("✅ [useDriverAvailability] Disponibilidad actualizada:", msg.data.available);
                onUpdate(msg.data.available);
            }
        };

        channel.subscribe("availability", handler);
        console.log("✅ [useDriverAvailability] Suscrito al canal:", `driver-availability:${driverId}`);

        return () => {
            channel.unsubscribe("availability", handler);
            console.log("👋 [useDriverAvailability] Desuscrito del canal:", `driver-availability:${driverId}`);
        };
    }, [driverId]);
};
