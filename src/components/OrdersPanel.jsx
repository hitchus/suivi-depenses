import { useState, useEffect } from 'react'
import * as api from '../api'

const STATUS_LABEL = { pending: '⏳ En attente', ready: '✅ Prêt', delivered: '📦 Livré' }
const STATUS_NEXT  = { pending: 'ready', ready: 'delivered', delivered: 'pending' }

export default function OrdersPanel({ onClose }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  async function advance(order) {
    const next = STATUS_NEXT[order.status]
    const updated = await api.updateOrder(order.id, { status: next })
    setOrders(prev => prev.map(o => o.id === order.id ? updated : o))
  }

  async function remove(id) {
    if (!confirm('Supprimer cette commande ?')) return
    await api.deleteOrder(id)
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  const pending   = orders.filter(o => o.status === 'pending')
  const ready     = orders.filter(o => o.status === 'ready')
  const delivered = orders.filter(o => o.status === 'delivered')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal orders-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📋 Commandes ({orders.length})</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {loading && <p className="orders-loading">⏳ Chargement...</p>}

        {!loading && orders.length === 0 && (
          <p className="orders-empty">Aucune commande pour l'instant 🎉</p>
        )}

        {!loading && orders.length > 0 && (
          <div className="orders-list">
            {[...pending, ...ready, ...delivered].map(order => (
              <div key={order.id} className={`order-card order-${order.status}`}>
                <div className="order-card-header">
                  <div>
                    <span className="order-status-badge">{STATUS_LABEL[order.status]}</span>
                    <span className="order-name">{order.prenom} {order.nom}</span>
                  </div>
                  <span className="order-location">🏢 {order.immeuble} · Apt {order.appartement}</span>
                </div>

                <div className="order-items">
                  {order.items.map((item, i) => (
                    <span key={i} className="order-item-pill">
                      {item.emoji} {item.name} ×{item.qty} — {(item.unitPrice * item.qty).toFixed(2)} DH
                    </span>
                  ))}
                </div>

                <div className="order-card-footer">
                  <span className="order-email">✉️ {order.email}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}</span>
                </div>

                <div className="order-actions">
                  <button className="btn-order-advance" onClick={() => advance(order)}>
                    {order.status === 'pending'   && '✅ Marquer prêt'}
                    {order.status === 'ready'     && '📦 Marquer livré'}
                    {order.status === 'delivered' && '🔄 Remettre en attente'}
                  </button>
                  <button className="btn-order-delete" onClick={() => remove(order.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
