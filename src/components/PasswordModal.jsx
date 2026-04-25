import { useState } from 'react'

const ADMIN_PASSWORD = 'Adam@1234'

export default function PasswordModal({ onSuccess, onClose }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (value === ADMIN_PASSWORD) {
      setError(false)
      onSuccess(value)
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal password-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔒 Accès Admin</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="password-hint">Réservé à Adam uniquement 😎</p>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="pwd">Mot de passe</label>
            <input
              id="pwd"
              type="password"
              placeholder="••••••••"
              value={value}
              onChange={e => { setValue(e.target.value); setError(false) }}
              autoFocus
            />
          </div>

          {error && (
            <p className="form-error">❌ Mot de passe incorrect !</p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-confirm">
              🔓 Entrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
