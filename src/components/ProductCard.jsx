import { useRef } from 'react'
import { compressImage } from '../utils/imageUtils'

export default function ProductCard({ product, adminMode, onDelete, onToggleStock, onPromo, onRemovePromo, onImageChange }) {
  const { id, name, emoji, image, price, category, description, inStock, promo } = product
  const promoPrice = promo ? (price * (1 - promo.discount / 100)).toFixed(2) : null
  const fileRef = useRef()

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const base64 = await compressImage(file)
      onImageChange(id, base64)
    } catch {
      alert('Erreur lors du chargement de la photo')
    }
    e.target.value = ''
  }

  return (
    <div className={`product-card ${!inStock ? 'out-of-stock' : ''} ${promo ? 'has-promo' : ''}`}>
      {promo && <div className="promo-badge">-{promo.discount}%</div>}
      {!inStock && (
        <div className="soldout-overlay"><span>ÉPUISÉ</span></div>
      )}

      {/* Image ou Emoji */}
      <div
        className={`card-media ${adminMode ? 'card-media-editable' : ''}`}
        onClick={() => adminMode && fileRef.current.click()}
        title={adminMode ? 'Cliquer pour changer la photo' : ''}
      >
        {image ? (
          <img src={image} alt={name} className="card-image" />
        ) : (
          <span className="card-emoji">{emoji}</span>
        )}
        {adminMode && (
          <div className="card-media-overlay">📷</div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

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
          >
            {inStock ? '❌ Épuiser' : '✅ Restockez'}
          </button>

          {promo ? (
            <button className="btn-remove-promo" onClick={() => onRemovePromo(id)}>
              🏷️ Retirer promo
            </button>
          ) : (
            <button className="btn-promo" onClick={() => onPromo(product)}>
              🏷️ Promo
            </button>
          )}

          <button
            className="btn-delete"
            onClick={() => { if (confirm(`Supprimer "${name}" ?`)) onDelete(id) }}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  )
}
