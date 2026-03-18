# nuxt-poker

Nuxt 4 + TypeScript製の1人用テキサスホールデムポーカーゲーム（vs AI）。

## 技術スタック
- Nuxt 4 (`compatibilityDate: '2025-07-15'`、`srcDir` は `app/`)
- Vitest（テスト）、@nuxt/eslint（ESLint 9 flat config）

## ディレクトリ構成
```
app/
  composables/
    usePoker.ts    # 純粋関数のみ（型定義・デッキ・役評価）
    useGame.ts     # ゲーム状態機械（useState singleton）
    useAI.ts       # AI意思決定 + GamePhase/BettingState型定義
    usePlayer.ts   # チップ管理
    useItems.ts    # アイテム管理
  components/      # Card, CommunityCards, PlayerHand, BettingControls, GameStatus, ResultOverlay
  pages/index.vue  # メインページ
public/
  suits/           # spade/heart/diamond/club.svg
  cards/           # back.svg, face-bg.svg
```

## ゲーム仕様
- SMALL_BLIND=10, BIG_BLIND=20, RAISE_AMOUNT=40, 初期チップ=1000
- フェーズ: IDLE→PREFLOP→FLOP→TURN→RIVER→SHOWDOWN→RESULT
- 連勝ボーナス（×1.2〜×2.5）＋役強さボーナス（×1.0〜×10.0）

## 型の依存関係
`GamePhase`, `BettingAction`, `BettingState` は `useAI.ts` で定義し、`useGame.ts` がインポート。

## テスト
- `vitest.setup.ts` で `useState` と `computed` をグローバルスタブ
- `useGame.ts`, `useItems.ts` はNuxtコンテキスト依存のため未テスト
- `npm test` / `npm run test:coverage`

## コマンド
```bash
npm run dev        # 開発サーバー
npm run build      # ビルド
npm test           # テスト実行
npm run lint       # ESLint
npm run commit     # commitizen
```
