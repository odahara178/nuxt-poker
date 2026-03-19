/**
 * Web Audio API を使った効果音合成。
 * 外部ファイル不要・著作権フリー。
 */
export function useSound() {
  function playCardDeal(count: number = 1) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => playOnce(), i * 130)
    }
  }

  function playOnce() {
    if (typeof window === 'undefined') return

    const AudioCtx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return

    const ctx = new AudioCtx()
    const durationSec = 0.07
    const bufferSize = Math.floor(ctx.sampleRate * durationSec)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    // ホワイトノイズ生成
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    // バンドパスフィルター（カードの紙質感に近い帯域）
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2800
    filter.Q.value = 0.7

    // 高域を少し落としてペーパー感を出す
    const shelf = ctx.createBiquadFilter()
    shelf.type = 'highshelf'
    shelf.frequency.value = 5000
    shelf.gain.value = -8

    // ゲインエンベロープ（急な立ち上がり → 素早いディケイ）
    const gain = ctx.createGain()
    const now = ctx.currentTime
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.35, now + 0.003)
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec)

    source.connect(filter)
    filter.connect(shelf)
    shelf.connect(gain)
    gain.connect(ctx.destination)

    source.start(now)
    source.onended = () => ctx.close()
  }

  return { playCardDeal }
}
