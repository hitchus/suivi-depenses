export default function ProductCard({ product, adminMode, onDelete, onToggleStock, onPromo, onRemovePromo }) {
  const { id, name, emoji, price, category, description, inStock, promo } = product

  const promoPrice = promo ? (price * (1 - promo.discount / 100)).toFixed(2) : null

  return (
    <div className={`product-card ${!inStock ? 'out-of-stock' : ''} ${promo ? 'has-promo' : ''}`}>
      {promo && (
        <div className="promo-badge">-{promo.discount}%</div>
      )}
      {!inStock && (
        <div className="soldout-overlay">
          <span>ÉPUISÉ</span>
        </div>
      )}

      <div className="card-emoji">{emoji}</div>
      <div className="card-category-tag">
        {category === 'glace' ? '🍦 Glace' : '🍬 Friandise'}
      </div>
      <h3 className="card-name">{name}</h3>
      <p className="card-description">{description}</p>

      <div className="card-price-row">
        {promo ? (
          <>
            <span className="price-original">{price.toFixed(2)} DH</span>
            <span className="price-promo">{promoPrice} DH</span>
          </>
        ) : (
          <span className="price">{price.toFixed(2)} DH</span>
        )}
      </div>

      {adminMode && (
        <div className="card-actions">
          <button
            className={`btn-stock ${inStock ? 'btn-soldout' : 'btn-restock'}`}
            onClick={() => onToggleStock(id)}
            title={inStock ? 'Marquer épuisé' : 'Remettre en stock'}
          >
            {inStock ? '❌ Épuiser' : '✅ Restockez'}
          </button>

          {promo ? (
            <button
              className="btn-remove-promo"
              onClick={() => onRemovePromo(id)}
              title="Supprimer la promo"
            >
              🏷️ Retirer promo
            </button>
          ) : (
            <button
              className="btn-promo"
              onClick={() => onPromo(product)}
              title="Ajouter une promotion"
            >
              🏷️ Promo
            </button>
          )}

          <button
            className="btn-delete"
            onClick={() => {
              if (confirm(`Supprimer "${name}" ?`)) onDelete(id)
            }}
            title="Supprimer le produit"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  )
}
