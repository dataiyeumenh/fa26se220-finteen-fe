import { firebaseConfig as config } from './config.js'
export const googleReady = Object.values(config).every(Boolean)

export async function googleIdToken() {
  if (!googleReady) throw new Error('Đăng nhập Google đang chờ cấu hình Firebase.')
  const { initializeApp, getApps } = await import('firebase/app')
  const { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, inMemoryPersistence, signOut } = await import('firebase/auth')
  const app = getApps().find(a => a.name === 'finteen-auth') || initializeApp(config, 'finteen-auth')
  const firebaseAuth = getAuth(app)
  await setPersistence(firebaseAuth, inMemoryPersistence)
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  try {
    const { user } = await signInWithPopup(firebaseAuth, provider)
    return await user.getIdToken()
  } catch (error) {
    const messages = {
      'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ Google. Có thể thử lại khi sẵn sàng.',
      'auth/popup-blocked': 'Trình duyệt chặn cửa sổ Google. Hãy cho phép cửa sổ bật lên rồi thử lại.',
      'auth/unauthorized-domain': 'Tên miền này chưa được cho phép trong Firebase.',
      'auth/network-request-failed': 'Không kết nối được Google. Hãy kiểm tra mạng.',
    }
    throw new Error(messages[error.code] || 'Chưa đăng nhập được Google. Vui lòng kiểm tra cấu hình hoặc thử lại.', { cause: error })
  } finally { await signOut(firebaseAuth).catch(() => {}) }
}
