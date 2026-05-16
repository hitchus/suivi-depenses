import { useRef, useState } from 'react'
import { compressImage } from '../utils/imageUtils'

export default function ProductCard({ product, adminMode, onDelete, onToggleStock, onPromo, onRemovePromo, onImageChange, onAddToCart, cartQty, onStockChange, onPriceChange }) {
  const { id, name, emoji, image, price, category, description, inStock, promo, stock } = product
  const promoPrice = promo ? (price * (1 - promo.discount / 100)).toFixed(2) : null
  const fileRef = useRef()
  const [editStock, setEditStock] = useState(false)
  const [stockInput, setStockInput] = useState(stock ?? 0)
  const [editPrice, setEditPrice] = useState(false)
  const [priceInput, setPriceInput] = useState(price)

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const base64 = await compressImage(file)
      onImageChange(id, base64)
    } catch { alert('Erreur lors du chargement de la photo') }
    e.target.value = ''
  }

  function saveStock() {
    const val = parseInt(stockInput)
    if (!isNaN(val) && val >= 0) onStockChange(id, val)
    setEditStock(false)
  }

  function savePrice() {
    const val = parseFloat(priceInput)
    if (!isNaN(val) && val > 0) onPriceChange(id, val)
    setEditPrice(false)
  }

  const stockLevel = stock === undefined ? null : stock
  const isLow = stockLevel !== null && stockLevel > 0 && stockLevel <= 3

  return (
    <div className={`product-card ${!inStock ? 'out-of-stock' : ''} ${promo ? 'has-promo' : ''}`}>
      {promo && <div className="promo-badge">-{promo.discount}%</div>}
      {!inStock && <div className="soldout-overlay"><span>ÉPUISÉ</span></div>}

      <div
        className={`card-media ${adminMode ? 'card-media-editable' : ''}`}
        onClick={() => adminMode && fileRef.current.click()}
        title={adminMode ? 'Cliquer pour changer la photo' : ''}
      >
        {image ? <img src={image} alt={name} className="card-image" /> : <span className="card-emoji">{emoji}</span>}
        {adminMode && <div className="card-media-overlay">📷</div>}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>

      <div className="card-category-tag">
        {category === 'glace' ? '🍦 Glace' : '🍬 Friandise'}
      </div>
      <h3 className="card-name">{name}</h3>
      <p className="card-description">{description}</p>

      {stockLevel !== null && inStock && (
        <div className={`stock-badge ${isLow ? 'stock-low' : ''}`}>
          {isLow ? '⚠️' : '📦'} Il reste <strong>{stockLevel}</strong>
        </div>
      )}

      {/* Prix — cliquable en mode admin */}
      <div className="card-price-row">
        {adminMode ? (
          editPrice ? (
            <div className="price-input-row">
              <input
                className="price-input"
                type="number"
                min="0.5"
                step="0.5"
                value={priceInput}
                onChange={e => setPriceInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') savePrice(); if (e.key === 'Escape') setEditPrice(false) }}
                autoFocus
              />
              <span className="price-input-unit">DH</span>
              <button className="stock-save" onClick={savePrice}>✓</button>
            </div>
          ) : (
            <button className="price-edit-btn" onClick={() => { setPriceInput(price); setEditPrice(true) }}>
              {promo ? (
                <><span className="price-original">{price.toFixed(2)} DH</span> → <span className="price-promo">{promoPrice} DH</span></>
              ) : (
                <span className="price">{price.toFixed(2)} DH</span>
              )}
              <span className="price-edit-hint">✏️</span>
            </button>
          )
        ) : (
          promo ? (
            <><span className="price-original">{price.toFixed(2)} DH</span><span className="price-promo">{promoPrice} DH</span></>
          ) : (
            <span className="price">{price.toFixed(2)} DH</span>
          )
        )}
      </div>

      {!adminMode && inStock && (
        <button className="btn-add-cart" onClick={() => onAddToCart(product)}>
          {cartQty > 0 ? `🛒 Dans le panier (${cartQty})` : '🛒 Commander'}
        </button>
      )}

      {adminMode && (
        <div className="card-actions">
          <div className="stock-editor">
            <span className="stock-editor-label">Stock :</span>
            {editStock ? (
              <div className="stock-input-row">
                <input
                  className="stock-input"
                  type="number"
                  min="0"
                  value={stockInput}
                  onChange={e => setStockInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveStock()}
                  autoFocus
                />
                <button className="stock-save" onClick={saveStock}>✓</button>
              </div>
            ) : (
              <button className="stock-display" onClick={() => { setStockInput(stock ?? 0); setEditStock(true) }}>
                <strong>{stock ?? 0}</strong> unité{stock !== 1 ? 's' : ''} ✏️
              </button>
            )}
          </div>

          <button className={`btn-stock ${inStock ? 'btn-soldout' : 'btn-restock'}`} onClick={() => onToggleStock(id)}>
            {inStock ? '❌ Épuiser' : '✅ Restockez'}
          </button>
          {promo ? (
            <button className="btn-remove-promo" onClick={() => onRemovePromo(id)}>🏷️ Retirer promo</button>
          ) : (
            <button className="btn-promo" onClick={() => onPromo(product)}>🏷️ Promo</button>
          )}
          <button className="btn-delete" onClick={() => { if (confirm(`Supprimer "${name}" ?`)) onDelete(id) }}>🗑️</button>
        </div>
      )}
    </div>
  )
}
