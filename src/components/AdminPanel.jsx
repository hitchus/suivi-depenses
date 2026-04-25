export default function AdminPanel({ onAddProduct }) {
  return (
    <div className="admin-panel">
      <div className="admin-panel-inner">
        <span className="admin-panel-title">⚙️ Mode Administrateur</span>
        <button className="btn-add" onClick={onAddProduct}>
          ➕ Ajouter un produit
        </button>
      </div>
    </div>
  )
}
