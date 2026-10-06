const env = import.meta.env

export const apiConfig = {
  baseUrl: (env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, ''),
  // Documentation URL only; requests use baseUrl, never the Swagger UI URL.
  swaggerUrl: (env.VITE_SWAGGER_URL || '').trim(),
}

if (!apiConfig.baseUrl) throw new Error('Thiếu VITE_API_BASE_URL. Hãy cấu hình .env rồi khởi động lại Vite.')

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}
