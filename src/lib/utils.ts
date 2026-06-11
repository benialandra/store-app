// Utility untuk generate kode akses pesanan yang unik dan mudah diingat
export function generateOrderCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Tanpa 0, O, I, 1 untuk menghindari ambigu
  let code = 'DS-' // Prefix DevStore
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
