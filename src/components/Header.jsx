export default function Header({ adminMode, onToggleAdmin, availableCount, soldOutCount, promoCount }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-brand">
          <img src="/shop/logo.png" alt="Sun Square Almaz" className="header-logo" />
          <div>
            <h1 className="header-title">La Boutique d'Adam</h1>
            <p className="header-subtitle">🍦 Glaces & Friandises · Sun Square Almaz</p>
          </div>
        </div>
        <button
          className={`admin-toggle ${adminMode ? 'active' : ''}`}
          onClick={onToggleAdmin}
          title="Mode administrateur"
        >
          {adminMode ? '🔓 Admin ON' : '🔒 Admin'}
        </button>
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
    </header>
  )
}
