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

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [adminMode, setAdminMode] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    api.getProducts()
      .then(setProducts)
      .catch(() => setError('Impossible de charger les produits'))
      .finally(() => setLoading(false))
  }, [])

  function handleAdminToggle() {
    if (adminMode) {
      setAdminMode(false)
      setAdminToken(null)
    } else {
      setShowPasswordModal(true)
    }
  }

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
    const product = products.find(p => p.id === id)
    const updated = await api.updateProduct(id, { inStock: !product.inStock })
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
  }

  function openPromo(product) {
    setSelectedProduct(product)
    setShowPromoModal(true)
  }

  async function applyPromo(id, promo) {
    const updated = await api.updateProduct(id, { promo })
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
    setShowPromoModal(false)
    setSelectedProduct(null)
  }

  async function removePromo(id) {
    const updated = await api.updateProduct(id, { promo: null })
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
  }

  async function changeImage(id, image) {
    const updated = await api.updateProduct(id, { image })
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
  }

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
        <AdminPanel onAddProduct={() => setShowAddModal(true)} />
      )}

      <main className="main-content">
        <FilterBar
          filter={filter}
          onFilter={setFilter}
          categoryFilter={categoryFilter}
          onCategoryFilter={setCategoryFilter}
        />

        {loading && <div className="loading-state">⏳ Chargement des produits...</div>}
        {error   && <div className="error-state">❌ {error}</div>}
        {!loading && !error && (
          <ProductGrid
            products={filteredProducts}
            adminMode={adminMode}
            onDelete={deleteProduct}
            onToggleStock={toggleStock}
            onPromo={openPromo}
            onRemovePromo={removePromo}
            onImageChange={changeImage}
          />
        )}
      </main>

      {showAddModal && (
        <AddProductModal
          onAdd={addProduct}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showPromoModal && selectedProduct && (
        <PromoModal
          product={selectedProduct}
          onApply={(promo) => applyPromo(selectedProduct.id, promo)}
          onClose={() => { setShowPromoModal(false); setSelectedProduct(null) }}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          onSuccess={(pwd) => {
            setAdminToken(pwd)
            setAdminMode(true)
            setShowPasswordModal(false)
          }}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  )
}
