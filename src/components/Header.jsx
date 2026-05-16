import Logo from './Logo'
import BrandLogo from './BrandLogo'

export default function Header({ adminMode, onToggleAdmin, availableCount, soldOutCount, promoCount }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-brand">
          <BrandLogo size={72} />
          <div>
            <h1 className="header-title">Sweet Corner · Adam & Aicha</h1>
            <p className="header-subtitle">🍦 Glaces & Friandises · Sun Square Almaz</p>
          </div>
        </div>

        <div className="header-right">
          <div className="sunsquare-logo">
            <Logo size={44} />
          </div>
          {adminMode && (
            <button
              className="admin-toggle active"
              onClick={onToggleAdmin}
              title="Désactiver le mode admin"
            >
              🔓 Admin ON
            </button>
          )}
        </div>
      </div>

      <div className="header-slogan">
        🌿 On se régale, on garde la résidence propre — les poubelles sont nos amies !
      </div>

      <div className="header-stats">
        <div className="stat-badge stat-available">
          <span>✅</span>
          <span>{availableCount} dispo</span>
        </div>
        <div className="stat-badge stat-soldout">
          <span>❌</span>
          <span>{soldOutCount} épuisé{soldOutCount > 1 ? 's' : ''}</span>
        </div>
        <div className="stat-badge stat-promo">
          <span>🏷️</span>
          <span>{promoCount} promo{promoCount > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Bouton admin discret — bas à droite, quasi invisible */}
      {!adminMode && (
        <button className="admin-secret-btn" onClick={onToggleAdmin} title="">🔒</button>
      )}
    </header>
  )
}
