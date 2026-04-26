import { useState } from 'react'
import * as api from '../api'

const IMMEUBLES    = Array.from({ length: 16 }, (_, i) => i + 1)
const APPARTEMENTS = Array.from({ length: 24 }, (_, i) => i + 1)

export default function OrderModal({ cart, products, onUpdateQty, onClose, onSuccess }) {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', immeuble: '', appartement: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const items = cart.map(item => {
    const p = products.find(p => p.id === item.productId)
    if (!p) return null
    const unitPrice = p.promo ? p.price * (1 - p.promo.discount / 100) : p.price
    return { productId: p.id, name: p.name, emoji: p.emoji, qty: item.qty, unitPrice }
  }).filter(Boolean)

  const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0)

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); setError('') }

  async function handleSubmit(e) {
    e.preventDefault()
    const { prenom, nom, email, immeuble, appartement } = form
    if (!prenom || !nom || !email || !immeuble || !appartement)
      return setError('Tous les champs sont obligatoires')
    if (!email.includes('@'))
      return setError('Email invalide')
    if (items.length === 0)
      return setError('Votre panier est vide')
    setLoading(true)
    try {
      const result = await api.placeOrder({ ...form, items })
      onSuccess(result.products)
    } catch (e) {
      setError(e.message || 'Erreur lors de la commande, réessaie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal order-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📦 Votre commande</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* ── Panier modifiable ── */}
        <div className="order-summary">
          <p className="order-summary-title">Récapitulatif</p>

          {items.length === 0 && (
            <p className="cart-empty-msg">Votre panier est vide</p>
          )}

          {items.map(item => (
            <div key={item.productId} className="order-item-row">
              <span className="order-item-name">{item.emoji} {item.name}</span>
              <div className="order-item-controls">
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQty(item.productId, item.qty - 1)}
                >−</button>
                <span className="qty-value">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQty(item.productId, item.qty + 1)}
                >+</button>
              </div>
              <span className="order-item-price">{(item.unitPrice * item.qty).toFixed(2)} DH</span>
              <button
                className="order-item-remove"
                onClick={() => onUpdateQty(item.productId, 0)}
                title="Supprimer"
              >🗑️</button>
            </div>
          ))}

          {items.length > 0 && (
            <div className="order-summary-total">
              <span>Total</span>
              <span>{total.toFixed(2)} DH</span>
            </div>
          )}
        </div>

        {/* ── Formulaire ── */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Prénom *</label>
              <input placeholder="Prénom" value={form.prenom} onChange={e => set('prenom', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Nom *</label>
              <input placeholder="Nom" value={form.nom} onChange={e => set('nom', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" placeholder="exemple@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Immeuble *</label>
              <select value={form.immeuble} onChange={e => set('immeuble', e.target.value)}>
                <option value="">-- Choisir --</option>
                {IMMEUBLES.map(n => (
                  <option key={n} value={n}>Immeuble {n}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Appartement *</label>
              <select value={form.appartement} onChange={e => set('appartement', e.target.value)}>
                <option value="">-- Choisir --</option>
                {APPARTEMENTS.map(n => (
                  <option key={n} value={n}>Appartement {n}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="form-error">⚠️ {error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-confirm" disabled={loading || items.length === 0}>
              {loading ? '⏳ Envoi...' : '✅ Confirmer la commande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
