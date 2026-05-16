export default function BrandLogo({ size = 72 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Cercle de fond glassmorphism */}
      <circle cx="60" cy="60" r="56" fill="rgba(8,30,16,0.85)" stroke="#C9A84C" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="51" fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="0.6" />

      {/* Cornet de glace */}
      {/* Gaufrette */}
      <polygon points="60,90 43,55 77,55" fill="#C9A84C" opacity="0.9" />
      <line x1="60" y1="90" x2="48" y2="60" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
      <line x1="60" y1="90" x2="56" y2="57" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
      <line x1="60" y1="90" x2="64" y2="57" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
      <line x1="60" y1="90" x2="72" y2="60" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" />
      <line x1="46" y1="62" x2="74" y2="62" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
      <line x1="44" y1="67" x2="76" y2="67" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
      <line x1="43" y1="72" x2="77" y2="72" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />

      {/* Boule 1 — verte (bas) */}
      <ellipse cx="60" cy="52" rx="17" ry="10" fill="#1E6B3A" />
      <ellipse cx="60" cy="50" rx="17" ry="10" fill="#2a8f50" />
      <ellipse cx="57" cy="47" rx="6" ry="3" fill="rgba(255,255,255,0.12)" />

      {/* Boule 2 — crème (milieu) */}
      <ellipse cx="60" cy="40" rx="14" ry="9" fill="#e8c97a" />
      <ellipse cx="60" cy="38" rx="14" ry="9" fill="#f0d68a" />
      <ellipse cx="57" cy="35" rx="5" ry="2.5" fill="rgba(255,255,255,0.2)" />

      {/* Boule 3 — rose (haut) */}
      <ellipse cx="60" cy="30" rx="11" ry="8" fill="#e07a8a" />
      <ellipse cx="60" cy="28" rx="11" ry="8" fill="#f09090" />
      <ellipse cx="57" cy="25" rx="4" ry="2" fill="rgba(255,255,255,0.2)" />

      {/* Cerise */}
      <circle cx="63" cy="21" r="3" fill="#cc3344" />
      <path d="M63,21 Q67,16 65,13" fill="none" stroke="#2a8f50" strokeWidth="1.2" strokeLinecap="round" />

      {/* Étoiles décoratives */}
      <circle cx="22" cy="30" r="1" fill="#C9A84C" opacity="0.7" />
      <circle cx="98" cy="40" r="1.2" fill="#C9A84C" opacity="0.6" />
      <circle cx="25" cy="80" r="0.8" fill="#C9A84C" opacity="0.5" />
      <circle cx="95" cy="75" r="1" fill="#C9A84C" opacity="0.6" />
    </svg>
  )
}
