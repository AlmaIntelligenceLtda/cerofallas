import { useEffect } from 'react';
import { ably } from '@/lib/ably';
import { useUser } from '@clerk/clerk-expo';
import { RideRequest } from '@/types/ride';

export const useRideRequest = (onRequest: (data: RideRequest) => void) => {
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            console.warn("⚠️ [useRideRequest] Usuario no disponible aún.");
            return;
        }

        const channelName = `ride-request:${user.id}`;
        const channel = ably.channels.get(channelName);

        const handler = (msg: any) => {
            console.log("📥 [useRideRequest] Mensaje recibido en canal", channelName);
            console.log("📦 [useRideRequest] Datos recibidos:", msg.data);

            if (!msg.data?.fromUserId || !msg.data?.rideDetails) {
                console.warn("❌ [useRideRequest] Payload incompleto:", msg.data);
                return;
            }

            onRequest(msg.data as RideRequest);
        };

        channel.subscribe('request', handler);
        console.log("✅ [useRideRequest] Suscrito al canal:", channelName);

        return () => {
            channel.unsubscribe('request', handler);
            console.log("👋 [useRideRequest] Desuscrito del canal:", channelName);
        };
    }, [user]);
};
