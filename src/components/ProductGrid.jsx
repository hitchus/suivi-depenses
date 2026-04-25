import ProductCard from './ProductCard'

export default function ProductGrid({ products, adminMode, onDelete, onToggleStock, onPromo, onRemovePromo, onImageChange }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-emoji">🫙</span>
        <p>Aucun produit ici pour l'instant</p>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          adminMode={adminMode}
          onDelete={onDelete}
          onToggleStock={onToggleStock}
          onPromo={onPromo}
          onRemovePromo={onRemovePromo}
          onImageChange={onImageChange}
        />
      ))}
    </div>
  )
}
