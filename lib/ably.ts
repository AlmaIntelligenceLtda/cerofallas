import Ably from 'ably-react-native';

export const ably = new Ably.Realtime.Promise({
  key: process.env.EXPO_PUBLIC_ABLY_PUBLIC_KEY!,
  autoConnect: true,
});

// Log: conexión exitosa
ably.connection.on('connected', () => {
  console.log('✅ [Ably] Conectado correctamente al servicio en tiempo real');
});

// Log: desconexión
ably.connection.on('disconnected', () => {
  console.log('⚠️ [Ably] Desconectado del servicio. Intentando reconectar...');
});

// Log: reconectado
ably.connection.on('connecting', () => {
  console.log('🔄 [Ably] Intentando reconectar...');
});

// Log: error de conexión
ably.connection.on('failed', (stateChange) => {
  console.log('❌ [Ably] Error de conexión:', stateChange.reason);
});

// Log: cualquier cambio de estado
ably.connection.on((stateChange) => {
  console.log('📶 [Ably] Estado de conexión cambiado:', stateChange.current);
});
