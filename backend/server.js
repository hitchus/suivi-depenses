const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'Adam@1234'
const DATA_FILE   = path.join(__dirname, 'products.json')
const ORDERS_FILE = path.join(__dirname, 'orders.json')

app.use(express.json({ limit: '15mb' }))

// ── Produits par défaut ─────────────────────────────────────────────
const DEFAULT_PRODUCTS = [
  { id: '1', name: 'Glace Vanille',       emoji: '🍦', image: null, price: 5, category: 'glace',     description: 'Douce glace à la vanille',    inStock: true,  stock: 10, promo: null },
  { id: '2', name: 'Glace Chocolat',      emoji: '🍫', image: null, price: 5, category: 'glace',     description: 'Glace au chocolat fondant',   inStock: true,  stock: 8,  promo: { discount: 20 } },
  { id: '3', name: 'Glace Fraise',        emoji: '🍓', image: null, price: 5, category: 'glace',     description: 'Glace à la fraise fraîche',   inStock: false, stock: 0,  promo: null },
  { id: '4', name: 'Bonbons Oursons',     emoji: '🐻', image: null, price: 2, category: 'friandise', description: 'Petits oursons gélifiés',     inStock: true,  stock: 20, promo: null },
  { id: '5', name: 'Chewing-gum',         emoji: '🫧', image: null, price: 1, category: 'friandise', description: 'Chewing-gum fruité',          inStock: true,  stock: 15, promo: { discount: 10 } },
  { id: '6', name: 'Sucette Arc-en-ciel', emoji: '🍭', image: null, price: 2, category: 'friandise', description: 'Sucette colorée et sucrée',   inStock: true,  stock: 12, promo: null },
  { id: '7', name: 'Esquimau Chocolat',   emoji: '🍡', image: null, price: 7, category: 'glace',     description: 'Esquimau enrobé de chocolat', inStock: false, stock: 0,  promo: null },
  { id: '8', name: 'Caramel Mou',         emoji: '🍬', image: null, price: 1, category: 'friandise', description: 'Caramel tendre et fondant',   inStock: true,  stock: 30, promo: null },
]

function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return fallback }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

if (!fs.existsSync(DATA_FILE))   writeJSON(DATA_FILE,   DEFAULT_PRODUCTS)
if (!fs.existsSync(ORDERS_FILE)) writeJSON(ORDERS_FILE, [])

// ── Auth ────────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  if (req.headers['x-admin-token'] !== ADMIN_TOKEN)
    return res.status(401).json({ error: 'Non autorisé' })
  next()
}

// ── Produits ────────────────────────────────────────────────────────
app.get('/api/products', (req, res) => res.json(readJSON(DATA_FILE, DEFAULT_PRODUCTS)))

app.post('/api/products', requireAdmin, (req, res) => {
  const products = readJSON(DATA_FILE, DEFAULT_PRODUCTS)
  const stock = parseInt(req.body.stock) || 0
  const product = {
    ...req.body,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    stock,
    inStock: stock > 0,
    promo: null,
  }
  products.push(product)
  writeJSON(DATA_FILE, products)
  res.json(product)
})

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const products = readJSON(DATA_FILE, DEFAULT_PRODUCTS)
  const idx = products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Produit non trouvé' })
  const updated = { ...products[idx], ...req.body }
  // Si le stock est mis à jour, sync inStock automatiquement
  if (req.body.stock !== undefined) {
    updated.stock = Math.max(0, parseInt(req.body.stock) || 0)
    updated.inStock = updated.stock > 0
  }
  products[idx] = updated
  writeJSON(DATA_FILE, products)
  res.json(products[idx])
})

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const products = readJSON(DATA_FILE, DEFAULT_PRODUCTS)
  writeJSON(DATA_FILE, products.filter(p => p.id !== req.params.id))
  res.json({ ok: true })
})

// ── Commandes ───────────────────────────────────────────────────────
app.post('/api/orders', (req, res) => {
  const { prenom, nom, email, immeuble, appartement, items } = req.body
  if (!prenom || !nom || !email || !immeuble || !appartement || !items?.length)
    return res.status(400).json({ error: 'Informations manquantes' })

  // Vérifier et décrémenter le stock
  const products = readJSON(DATA_FILE, DEFAULT_PRODUCTS)
  for (const item of items) {
    const p = products.find(p => p.id === item.productId)
    if (!p || !p.inStock) return res.status(400).json({ error: `"${item.name}" n'est plus disponible` })
    if (p.stock !== undefined && p.stock < item.qty)
      return res.status(400).json({ error: `Stock insuffisant pour "${item.name}" (reste: ${p.stock})` })
  }

  // Décrémenter le stock
  for (const item of items) {
    const idx = products.findIndex(p => p.id === item.productId)
    if (idx === -1) continue
    if (products[idx].stock !== undefined) {
      products[idx].stock = Math.max(0, products[idx].stock - item.qty)
      if (products[idx].stock === 0) products[idx].inStock = false
    }
  }
  writeJSON(DATA_FILE, products)

  // Enregistrer la commande
  const orders = readJSON(ORDERS_FILE, [])
  const order = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    prenom, nom, email, immeuble, appartement,
    items,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  orders.unshift(order)
  writeJSON(ORDERS_FILE, orders)

  // Retourner la commande + les produits mis à jour
  res.json({ order, products })
})

app.get('/api/orders', requireAdmin, (req, res) => {
  res.json(readJSON(ORDERS_FILE, []))
})

app.put('/api/orders/:id', requireAdmin, (req, res) => {
  const orders = readJSON(ORDERS_FILE, [])
  const idx = orders.findIndex(o => o.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Commande non trouvée' })
  orders[idx] = { ...orders[idx], ...req.body }
  writeJSON(ORDERS_FILE, orders)
  res.json(orders[idx])
})

app.delete('/api/orders/:id', requireAdmin, (req, res) => {
  const orders = readJSON(ORDERS_FILE, [])
  writeJSON(ORDERS_FILE, orders.filter(o => o.id !== req.params.id))
  res.json({ ok: true })
})

app.listen(PORT, () => console.log(`Adam Shop API démarrée sur le port ${PORT}`))
