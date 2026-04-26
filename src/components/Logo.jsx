export default function Logo({ size = 70 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Fond blanc */}
      <rect width="200" height="200" fill="white" />

      {/* Cadre extérieur or */}
      <rect x="4" y="4" width="192" height="192" fill="none" stroke="#C9A84C" strokeWidth="3" />
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="#C9A84C" strokeWidth="0.8" />

      {/* Motif arabesque — coins */}
      {/* Coin haut-gauche */}
      <path d="M10,40 Q20,20 40,10" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
      <path d="M10,30 Q25,15 30,10" fill="none" stroke="#C9A84C" strokeWidth="0.8"/>
      <circle cx="20" cy="20" r="4" fill="none" stroke="#C9A84C" strokeWidth="1"/>
      <circle cx="20" cy="20" r="1.5" fill="#C9A84C"/>

      {/* Coin haut-droit */}
      <path d="M190,40 Q180,20 160,10" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
      <path d="M190,30 Q175,15 170,10" fill="none" stroke="#C9A84C" strokeWidth="0.8"/>
      <circle cx="180" cy="20" r="4" fill="none" stroke="#C9A84C" strokeWidth="1"/>
      <circle cx="180" cy="20" r="1.5" fill="#C9A84C"/>

      {/* Coin bas-gauche */}
      <path d="M10,160 Q20,180 40,190" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
      <path d="M10,170 Q25,185 30,190" fill="none" stroke="#C9A84C" strokeWidth="0.8"/>
      <circle cx="20" cy="180" r="4" fill="none" stroke="#C9A84C" strokeWidth="1"/>
      <circle cx="20" cy="180" r="1.5" fill="#C9A84C"/>

      {/* Coin bas-droit */}
      <path d="M190,160 Q180,180 160,190" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
      <path d="M190,170 Q175,185 170,190" fill="none" stroke="#C9A84C" strokeWidth="0.8"/>
      <circle cx="180" cy="180" r="4" fill="none" stroke="#C9A84C" strokeWidth="1"/>
      <circle cx="180" cy="180" r="1.5" fill="#C9A84C"/>

      {/* Fleurs milieu des bords */}
      <circle cx="100" cy="10"  r="3" fill="#C9A84C"/>
      <circle cx="100" cy="190" r="3" fill="#C9A84C"/>
      <circle cx="10"  cy="100" r="3" fill="#C9A84C"/>
      <circle cx="190" cy="100" r="3" fill="#C9A84C"/>

      {/* Losanges décoratifs */}
      <polygon points="100,14 104,10 100,6 96,10"  fill="#C9A84C"/>
      <polygon points="100,194 104,190 100,186 96,190" fill="#C9A84C"/>
      <polygon points="14,100 10,104 6,100 10,96"  fill="#C9A84C"/>
      <polygon points="194,100 190,104 186,100 190,96" fill="#C9A84C"/>

      {/* Carré vert central */}
      <rect x="38" y="38" width="124" height="124" fill="#1A5C35" />

      {/* Texte SUN */}
      <text
        x="100" y="98"
        textAnchor="middle"
        fill="#C9A84C"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="46"
        fontWeight="bold"
        letterSpacing="2"
      >SUN</text>

      {/* Texte SQUARE */}
      <text
        x="100" y="130"
        textAnchor="middle"
        fill="#C9A84C"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="24"
        fontWeight="bold"
        letterSpacing="1"
      >SQUARE</text>

      {/* Séparateur */}
      <line x1="60" y1="138" x2="140" y2="138" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>

      {/* Texte ALMAZ */}
      <text
        x="100" y="152"
        textAnchor="middle"
        fill="white"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="14"
        letterSpacing="6"
        fontWeight="300"
      >ALMAZ</text>
    </svg>
  )
}
