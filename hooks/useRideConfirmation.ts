import { useEffect } from 'react';
import { ably } from '@/lib/ably';

export const useRideConfirmation = (
    clientId: string,
    onAccept: (driverId: string) => void
) => {
    useEffect(() => {
        if (!clientId) {
            console.warn("⚠️ [useRideConfirmation] clientId no definido");
            return;
        }

        const channelName = `ride-confirm:${clientId}`;
        const channel = ably.channels.get(channelName);

        const handler = (msg: any) => {
            console.log("📥 [useRideConfirmation] Confirmación recibida en canal:", channelName);
            console.log("📦 [useRideConfirmation] Datos recibidos:", msg.data);

            if (msg.data?.acceptedBy) {
                console.log("✅ [useRideConfirmation] Viaje aceptado por:", msg.data.acceptedBy);
                onAccept(msg.data.acceptedBy);
            } else {
                console.warn("❌ [useRideConfirmation] Mensaje sin campo 'acceptedBy':", msg.data);
            }
        };

        channel.subscribe("accepted", handler);
        console.log("✅ [useRideConfirmation] Suscrito al canal:", channelName);

        return () => {
            channel.unsubscribe("accepted", handler);
            console.log("👋 [useRideConfirmation] Desuscrito del canal:", channelName);
        };
    }, [clientId]);
};
