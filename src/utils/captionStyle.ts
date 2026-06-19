const STOPWORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
  'y', 'o', 'u', 'a', 'en', 'que', 'es', 'se', 'su', 'sus', 'lo', 'le', 'les',
  'por', 'para', 'con', 'sin', 'no', 'si', 'ya', 'mas', 'pero', 'como',
  'esto', 'eso', 'esta', 'este', 'estos', 'estas', 'yo', 'tu', 'el', 'ella',
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'is', 'are', 'was',
  'were', 'it', 'this', 'that', 'i', 'you', 'we', 'they', 'be', 'for', 'with',
])

const EMOJI_MAP: Record<string, string> = {
  dinero: '💰', plata: '💰', pagar: '💰', precio: '💰', gratis: '🆓',
  amor: '❤️', feliz: '😄', triste: '😢', miedo: '😱', cuidado: '⚠️',
  peligro: '⚠️', fuego: '🔥', increible: '🤯', genial: '🔥', rapido: '⚡',
  lento: '🐢', tiempo: '⏰', video: '🎥', camara: '📷', musica: '🎵',
  importante: '❗', secreto: '🤫', exito: '🏆', victoria: '🏆', error: '❌',
  problema: '⚠️', solucion: '✅', idea: '💡', amigos: '🤝', familia: '👨‍👩‍👧',
  comida: '🍔', viaje: '✈️', casa: '🏠', trabajo: '💼', estudio: '📚',
  salud: '💪', amor2: '💕', risa: '😂', nuevo: '✨', mejor: '👍',
  peor: '👎', love: '❤️', money: '💰', happy: '😄', fire: '🔥',
  amazing: '🤯', important: '❗', danger: '⚠️', success: '🏆', fail: '❌',
}

const DIACRITICS = /[̀-ͯ]/g

function normalize(word: string): string {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .replace(/[^a-z0-9]/g, '')
}

export function isEmphasized(word: string): boolean {
  const clean = normalize(word)
  if (clean.length === 0) return false
  if (STOPWORDS.has(clean)) return false
  return clean.length >= 6 || clean in EMOJI_MAP
}

export function emojiFor(word: string): string | null {
  const clean = normalize(word)
  return EMOJI_MAP[clean] ?? null
}
