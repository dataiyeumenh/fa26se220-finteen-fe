const base64 = value => btoa(String.fromCharCode(...new Uint8Array(value)))
const bytes = value => Uint8Array.from(atob(value), c => c.charCodeAt(0))
async function derive(secret, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveBits'])
  return base64(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256))
}
export async function createCredential(password) {
  if (password.length < 8) throw new Error('Mật khẩu cần ít nhất 8 ký tự.')
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return { salt: base64(salt), hash: await derive(password, salt) }
}
export async function verifyCredential(password, credential) {
  return Boolean(credential && await derive(password, bytes(credential.salt)) === credential.hash)
}
