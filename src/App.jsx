import { useState, useEffect } from 'react'
import * as api from './api'
import { setAdminToken } from './api'
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import AdminPanel from './components/AdminPanel'
import AddProductModal from './components/AddProductModal'
import PromoModal from './components/PromoModal'
import FilterBar from './components/FilterBar'
import PasswordModal from './components/PasswordModal'
import CartBar from './components/CartBar'
import OrderModal from './components/OrderModal'
import OrdersPanel from './components/OrdersPanel'

export default function App() {
  const [products, setProducts]             = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)
  const [filter, setFilter]                 = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [adminMode, setAdminMode]           = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showAddModal, setShowAddModal]     = useState(false)
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showOrdersPanel, setShowOrdersPanel] = useState(false)
  const [showConfirm, setShowConfirm]       = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart]                     = useState([])
  const [pendingCount, setPendingCount]     = useState(0)

  useEffect(() => {
    api.getProducts()
      .then(setProducts)
      .catch(() => setError('Impossible de charger les produits'))
      .finally(() => setLoading(false))
  }, [])

  // Recharge le nombre de commandes en attente quand on est admin
  useEffect(() => {
    if (!adminMode) return
    api.getOrders()
      .then(orders => setPendingCount(orders.filter(o => o.status === 'pending').length))
      .catch(() => {})
  }, [adminMode, showOrdersPanel])

  function handleAdminToggle() {
    if (adminMode) { setAdminMode(false); setAdminToken(null) }
    else setShowPasswordModal(true)
  }

  // ── Produits ──
  async function addProduct(data) {
    const product = await api.addProduct(data)
    setProducts(prev => [...prev, product])
    setShowAddModal(false)
  }
  async function deleteProduct(id) {
    await api.deleteProduct(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }
  async function toggleStock(id) {
    const p = products.find(p => p.id === id)
    const updated = await api.updateProduct(id, { inStock: !p.inStock })
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
  }
  async function applyPromo(id, promo) {
    const updated = await api.updateProduct(id, { promo })
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
    setShowPromoModal(false); setSelectedProduct(null)
  }
  async function removePromo(id) {
    const updated = await api.updateProduct(id, { promo: null })
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
  }
  async function changeImage(id, image) {
    const updated = await api.updateProduct(id, { image })
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
  }
  async function changeStock(id, stock) {
    const updated = await api.updateProduct(id, { stock })
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
  }
  async function changePrice(id, price) {
    const updated = await api.updateProduct(id, { price })
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
  }

  // ── Panier ──
  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id)
      if (existing) return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { productId: product.id, qty: 1 }]
    })
  }
  function updateCartQty(productId, qty) {
    if (qty <= 0) setCart(prev => prev.filter(i => i.productId !== productId))
    else setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty } : i))
  }
  function clearCart() { setCart([]) }

  const filteredProducts = products.filter(p => {
    const stockMatch = filter === 'all' ? true : filter === 'available' ? p.inStock : !p.inStock
    const catMatch   = categoryFilter === 'all' ? true : p.category === categoryFilter
    return stockMatch && catMatch
  })

  const availableCount = products.filter(p => p.inStock).length
  const soldOutCount   = products.filter(p => !p.inStock).length
  const promoCount     = products.filter(p => p.promo).length

  return (
    <div className="app">
      <Header
        adminMode={adminMode}
        onToggleAdmin={handleAdminToggle}
        availableCount={availableCount}
        soldOutCount={soldOutCount}
        promoCount={promoCount}
      />

      {adminMode && (
        <AdminPanel
          onAddProduct={() => setShowAddModal(true)}
          onViewOrders={() => setShowOrdersPanel(true)}
          pendingCount={pendingCount}
        />
      )}

      <main className="main-content">
        <FilterBar filter={filter} onFilter={setFilter} categoryFilter={categoryFilter} onCategoryFilter={setCategoryFilter} />
        {loading && <div className="loading-state">⏳ Chargement des produits...</div>}
        {error   && <div className="error-state">❌ {error}</div>}
        {!loading && !error && (
          <ProductGrid
            products={filteredProducts}
            adminMode={adminMode}
            onDelete={deleteProduct}
            onToggleStock={toggleStock}
            onPromo={p => { setSelectedProduct(p); setShowPromoModal(true) }}
            onRemovePromo={removePromo}
            onImageChange={changeImage}
            onAddToCart={addToCart}
            cart={cart}
            onStockChange={changeStock}
            onPriceChange={changePrice}
          />
        )}
      </main>

      <CartBar
        cart={cart}
        products={products}
        onCheckout={() => setShowOrderModal(true)}
        onClear={clearCart}
      />

      {showAddModal && (
        <AddProductModal onAdd={addProduct} onClose={() => setShowAddModal(false)} />
      )}
      {showPromoModal && selectedProduct && (
        <PromoModal
          product={selectedProduct}
          onApply={promo => applyPromo(selectedProduct.id, promo)}
          onClose={() => { setShowPromoModal(false); setSelectedProduct(null) }}
        />
      )}
      {showOrderModal && (
        <OrderModal
          cart={cart}
          products={products}
          onUpdateQty={updateCartQty}
          onClose={() => setShowOrderModal(false)}
          onSuccess={(updatedProducts) => {
            if (updatedProducts) setProducts(updatedProducts)
            clearCart()
            setShowOrderModal(false)
            setShowConfirm(true)
          }}
        />
      )}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-emoji">🎉</div>
            <h2 className="confirm-title">Commande reçue !</h2>
            <p className="confirm-text">Adam & Aicha vont préparer ta commande et passer chez toi très bientôt.</p>
            <button className="btn-confirm" onClick={() => setShowConfirm(false)}>Super, merci !</button>
          </div>
        </div>
      )}
      {showOrdersPanel && (
        <OrdersPanel onClose={() => setShowOrdersPanel(false)} />
      )}
      {showPasswordModal && (
        <PasswordModal
          onSuccess={pwd => { setAdminToken(pwd); setAdminMode(true); setShowPasswordModal(false) }}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  )
}
