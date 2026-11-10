export function Crest() {
  return (
    <svg viewBox="0 0 100 120" className="h-20 w-auto" aria-label="Republic Hall crest">
      <path d="M50 4 L94 18 V58 C94 88 72 106 50 116 C28 106 6 88 6 58 V18 Z" fill="var(--primary)" stroke="var(--accent)" strokeWidth="4" />
      <path d="M50 16 L82 26 V58 C82 80 66 94 50 102 C34 94 18 80 18 58 V26 Z" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      <text x="50" y="58" textAnchor="middle" fontFamily="Merriweather, serif" fontWeight="700" fontSize="26" fill="var(--accent)">RH</text>
      <path d="M30 72 h40 M34 80 h32" stroke="var(--accent)" strokeWidth="2" />
      <text x="50" y="94" textAnchor="middle" fontFamily="Merriweather, serif" fontSize="7" fill="var(--paper)">KNUST</text>
    </svg>
  );
}
