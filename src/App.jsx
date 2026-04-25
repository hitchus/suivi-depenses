import { useState, useEffect } from 'react'
import { loadProducts, saveProducts, generateId } from './store'
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import AdminPanel from './components/AdminPanel'
import AddProductModal from './components/AddProductModal'
import PromoModal from './components/PromoModal'
import FilterBar from './components/FilterBar'
import PasswordModal from './components/PasswordModal'

export default function App() {
  const [products, setProducts] = useState(() => loadProducts())
  const [filter, setFilter] = useState('all') // 'all' | 'available' | 'soldout'
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all' | 'glace' | 'friandise'
  const [adminMode, setAdminMode] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  function handleAdminToggle() {
    if (adminMode) {
      setAdminMode(false)
    } else {
      setShowPasswordModal(true)
    }
  }

  useEffect(() => {
    saveProducts(products)
  }, [products])

  const filteredProducts = products.filter(p => {
    const stockMatch =
      filter === 'all' ? true :
      filter === 'available' ? p.inStock :
      !p.inStock
    const catMatch =
      categoryFilter === 'all' ? true :
      p.category === categoryFilter
    return stockMatch && catMatch
  })

  function addProduct(data) {
    setProducts(prev => [...prev, { ...data, id: generateId(), inStock: true, promo: null }])
    setShowAddModal(false)
  }

  function deleteProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  function toggleStock(id) {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p)
    )
  }

  function openPromo(product) {
    setSelectedProduct(product)
    setShowPromoModal(true)
  }

  function applyPromo(id, promo) {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, promo } : p)
    )
    setShowPromoModal(false)
    setSelectedProduct(null)
  }

  function removePromo(id) {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, promo: null } : p)
    )
  }

  const availableCount = products.filter(p => p.inStock).length
  const soldOutCount = products.filter(p => !p.inStock).length
  const promoCount = products.filter(p => p.promo).length

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
        <ProductGrid
          products={filteredProducts}
          adminMode={adminMode}
          onDelete={deleteProduct}
          onToggleStock={toggleStock}
          onPromo={openPromo}
          onRemovePromo={removePromo}
        />
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
          onSuccess={() => { setAdminMode(true); setShowPasswordModal(false) }}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  )
}
