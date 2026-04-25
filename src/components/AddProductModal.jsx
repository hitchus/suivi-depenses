import { useState } from 'react'

const EMOJI_OPTIONS = [
  '🍦', '🍫', '🍓', '🍧', '🍨', '🍡', '🧁', '🍰',
  '🍬', '🍭', '🍮', '🍯', '🧃', '🥤', '🫧', '🐻',
  '🍎', '🍋', '🍇', '🍒', '🥭', '🍑', '🍈', '🫐',
]

export default function AddProductModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    name: '',
    emoji: '🍦',
    price: '',
    category: 'glace',
    description: '',
  })
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return setError('Le nom est obligatoire')
    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) return setError('Prix invalide')
    setError('')
    onAdd({ ...form, price })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Nouveau produit</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Emoji</label>
            <div className="emoji-picker">
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  type="button"
                  className={`emoji-option ${form.emoji === e ? 'selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, emoji: e }))}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Nom du produit *</label>
            <input
              id="name"
              type="text"
              placeholder="Ex: Glace pistache"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Prix (€) *</label>
              <input
                id="price"
                type="number"
                step="0.10"
                min="0.10"
                placeholder="1.50"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                <option value="glace">🍦 Glace</option>
                <option value="friandise">🍬 Friandise</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              placeholder="Courte description..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-confirm">
              ✅ Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
