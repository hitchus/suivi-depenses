export default function AdminPanel({ onAddProduct, onViewOrders, pendingCount }) {
  return (
    <div className="admin-panel">
      <div className="admin-panel-inner">
        <span className="admin-panel-title">⚙️ Mode Administrateur</span>
        <div className="admin-panel-buttons">
          <button className="btn-orders" onClick={onViewOrders}>
            📋 Commandes {pendingCount > 0 && <span className="orders-badge">{pendingCount}</span>}
          </button>
          <button className="btn-add" onClick={onAddProduct}>
            ➕ Ajouter un produit
          </button>
        </div>
      </div>
    </div>
  )
}
