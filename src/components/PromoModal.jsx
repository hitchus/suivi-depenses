import { useState } from 'react'

const PRESETS = [10, 15, 20, 25, 30, 50]

export default function PromoModal({ product, onApply, onClose }) {
  const [discount, setDiscount] = useState(product.promo?.discount ?? 20)

  const promoPrice = (product.price * (1 - discount / 100)).toFixed(2)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏷️ Promotion</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="promo-product-preview">
          <span className="promo-preview-emoji">{product.emoji}</span>
          <span className="promo-preview-name">{product.name}</span>
        </div>

        <div className="promo-form">
          <p className="promo-label">Choisir la réduction :</p>

          <div className="promo-presets">
            {PRESETS.map(p => (
              <button
                key={p}
                className={`promo-preset ${discount === p ? 'active' : ''}`}
                onClick={() => setDiscount(p)}
              >
                -{p}%
              </button>
            ))}
          </div>

          <div className="promo-custom">
            <label>Personnalisé :</label>
            <div className="promo-slider-row">
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
              />
              <span className="promo-value">-{discount}%</span>
            </div>
          </div>

          <div className="promo-preview-price">
            <span className="price-was">Avant : {product.price.toFixed(2)} DH</span>
            <span className="price-now">Après : {promoPrice} DH</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-confirm" onClick={() => onApply({ discount })}>
            ✅ Appliquer
          </button>
        </div>
      </div>
    </div>
  )
}
