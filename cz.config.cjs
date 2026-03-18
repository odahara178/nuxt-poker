module.exports = {
  types: [
    { value: "✨ feat", name: "✨ feat:     新機能" },
    { value: "🐛 fix", name: "🐛 fix:      バグ修正" },
    { value: "📝 docs", name: "📝 docs:     ドキュメント" },
    { value: "🎨 style", name: "🎨 style:    見た目調整" },
    { value: "♻️ refactor", name: "♻️ refactor: リファクタリング" },
    { value: "⚡ perf", name: "⚡ perf:     パフォーマンス改善" },
    { value: "🔥 remove", name: "🔥 remove:   削除" }
  ],
  messages: {
    type: "コミットの種類を選択:",
    subject: "変更内容を簡潔に:",
  }
};