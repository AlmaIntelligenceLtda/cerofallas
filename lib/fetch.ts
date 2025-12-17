const BASE_URL =
  "http://165.227.14.82:3000"; // fallback dev

// Validación opcional
if (!BASE_URL) {
  console.warn('⚠️ BASE_URL no está definida. Verifica EXPO_PUBLIC_SERVER_URL en .env');
}

// 🔁 Genérico para JSON
export const fetchAPI = async (path: string, options?: RequestInit) => {
  const url = `${BASE_URL}${path}`;
  try {
    console.log('[fetchAPI] Fetching URL:', url, 'Options:', options);
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    console.log('[fetchAPI] Response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP error ${response.status}: ${text}`);
    }

    const json = await response.json();
    console.log('[fetchAPI] Response JSON:', json);
    return json;
  } catch (error) {
    console.error('[fetchAPI] Fetch error:', error);
    throw error;
  }
};

// 🖼 Para subir imágenes y FormData
export const fetchFormAPI = async (path: string, formData: FormData) => {
  const url = `${BASE_URL}${path}`;
  try {
    console.log('[fetchFormAPI] Subiendo archivos a:', url);

    const response = await fetch(url, {
      method: 'POST',
      body: formData, // importante: no agregar headers aquí
    });

    console.log('[fetchFormAPI] Código de respuesta:', response.status);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error HTTP: ${response.status} - ${text}`);
    }

    const json = await response.json();
    console.log('[fetchFormAPI] Respuesta JSON:', json);
    return json;
  } catch (error) {
    console.error('[fetchFormAPI] Error en la subida:', error);
    throw error;
  }
};
