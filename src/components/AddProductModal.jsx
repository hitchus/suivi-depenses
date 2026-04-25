import { useState, useRef } from 'react'
import { compressImage } from '../utils/imageUtils'

const EMOJI_OPTIONS = [
  '🍦', '🍫', '🍓', '🍧', '🍨', '🍡', '🧁', '🍰',
  '🍬', '🍭', '🍮', '🍯', '🧃', '🥤', '🫧', '🐻',
  '🍎', '🍋', '🍇', '🍒', '🥭', '🍑', '🍈', '🫐',
]

export default function AddProductModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    name: '',
    emoji: '🍦',
    image: null,
    price: '',
    category: 'glace',
    description: '',
  })
  const [error, setError] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const fileRef = useRef()

  async function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageLoading(true)
    try {
      const base64 = await compressImage(file)
      setForm(f => ({ ...f, image: base64 }))
    } catch {
      setError('Erreur lors du chargement de la photo')
    } finally {
      setImageLoading(false)
    }
  }

  function removeImage() {
    setForm(f => ({ ...f, image: null }))
    if (fileRef.current) fileRef.current.value = ''
  }

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

          {/* Photo upload */}
          <div className="form-group">
            <label>Photo du produit</label>
            {form.image ? (
              <div className="image-preview-wrap">
                <img src={form.image} alt="aperçu" className="image-preview" />
                <button type="button" className="image-remove" onClick={removeImage}>
                  ✕ Changer
                </button>
              </div>
            ) : (
              <div className="image-upload-zone" onClick={() => fileRef.current.click()}>
                {imageLoading ? (
                  <span className="upload-loading">⏳ Compression...</span>
                ) : (
                  <>
                    <span className="upload-icon">📷</span>
                    <span className="upload-text">Cliquer pour ajouter une photo</span>
                    <span className="upload-hint">JPG, PNG — max 5 Mo</span>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>

          {/* Emoji (affiché si pas de photo) */}
          {!form.image && (
            <div className="form-group">
              <label>Emoji (si pas de photo)</label>
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
          )}

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
              <label htmlFor="price">Prix (DH) *</label>
              <input
                id="price"
                type="number"
                step="0.5"
                min="0.5"
                placeholder="5"
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
            <button type="submit" className="btn-confirm" disabled={imageLoading}>
              ✅ Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
