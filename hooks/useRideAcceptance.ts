import { ably } from "@/lib/ably";

// Hook para enviar la aceptación de un viaje
export const useRideAcceptance = () => {
    const acceptRide = async (clientId: string, driverId: string) => {
        try {
            // Obtener el canal de Ably para notificar al cliente sobre la aceptación
            const channel = ably.channels.get(`ride-confirm:${clientId}`);

            // Publicar el mensaje de aceptación
            await channel.publish("accepted", {
                fromUserId: clientId,  // ID del cliente
                acceptedBy: driverId,  // ID del conductor que acepta el viaje
            });

            console.log("✅[acceptRide] Viaje aceptado por:", driverId);
        } catch (error) {
            console.error("Error al aceptar viaje:", error);
        }
    };

    return { acceptRide };
};
