export default function CartBar({ cart, products, onCheckout, onClear }) {
  if (cart.length === 0) return null

  const total = cart.reduce((sum, item) => {
    const p = products.find(p => p.id === item.productId)
    if (!p) return sum
    const price = p.promo ? p.price * (1 - p.promo.discount / 100) : p.price
    return sum + price * item.qty
  }, 0)

  const totalItems = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="cart-bar">
      <div className="cart-bar-info">
        <span className="cart-bar-count">🛒 {totalItems} article{totalItems > 1 ? 's' : ''}</span>
        <span className="cart-bar-total">{total.toFixed(2)} DH</span>
      </div>
      <div className="cart-bar-actions">
        <button className="cart-bar-clear" onClick={onClear}>Vider</button>
        <button className="cart-bar-checkout" onClick={onCheckout}>
          Commander →
        </button>
      </div>
    </div>
  )
}
