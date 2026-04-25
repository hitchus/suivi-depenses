export default function FilterBar({ filter, onFilter, categoryFilter, onCategoryFilter }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-label">Afficher :</span>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => onFilter('all')}
          >
            Tout
          </button>
          <button
            className={`filter-btn available ${filter === 'available' ? 'active' : ''}`}
            onClick={() => onFilter('available')}
          >
            ✅ Disponibles
          </button>
          <button
            className={`filter-btn soldout ${filter === 'soldout' ? 'active' : ''}`}
            onClick={() => onFilter('soldout')}
          >
            ❌ Épuisés
          </button>
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">Catégorie :</span>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => onCategoryFilter('all')}
          >
            Tout
          </button>
          <button
            className={`filter-btn ${categoryFilter === 'glace' ? 'active' : ''}`}
            onClick={() => onCategoryFilter('glace')}
          >
            🍦 Glaces
          </button>
          <button
            className={`filter-btn ${categoryFilter === 'friandise' ? 'active' : ''}`}
            onClick={() => onCategoryFilter('friandise')}
          >
            🍬 Friandises
          </button>
        </div>
      </div>
    </div>
  )
}
