const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'Adam@1234'
const DATA_FILE = path.join(__dirname, 'products.json')

app.use(express.json({ limit: '15mb' }))

// ── Données par défaut ──────────────────────────────────────────────
const DEFAULT_PRODUCTS = [
  { id: '1', name: 'Glace Vanille',      emoji: '🍦', image: null, price: 5, category: 'glace',     description: 'Douce glace à la vanille',     inStock: true,  promo: null },
  { id: '2', name: 'Glace Chocolat',     emoji: '🍫', image: null, price: 5, category: 'glace',     description: 'Glace au chocolat fondant',    inStock: true,  promo: { discount: 20 } },
  { id: '3', name: 'Glace Fraise',       emoji: '🍓', image: null, price: 5, category: 'glace',     description: 'Glace à la fraise fraîche',    inStock: false, promo: null },
  { id: '4', name: 'Bonbons Oursons',    emoji: '🐻', image: null, price: 2, category: 'friandise', description: 'Petits oursons gélifiés',      inStock: true,  promo: null },
  { id: '5', name: 'Chewing-gum',        emoji: '🫧', image: null, price: 1, category: 'friandise', description: 'Chewing-gum fruité',           inStock: true,  promo: { discount: 10 } },
  { id: '6', name: 'Sucette Arc-en-ciel',emoji: '🍭', image: null, price: 2, category: 'friandise', description: 'Sucette colorée et sucrée',    inStock: true,  promo: null },
  { id: '7', name: 'Esquimau Chocolat',  emoji: '🍡', image: null, price: 7, category: 'glace',     description: 'Esquimau enrobé de chocolat',  inStock: false, promo: null },
  { id: '8', name: 'Caramel Mou',        emoji: '🍬', image: null, price: 1, category: 'friandise', description: 'Caramel tendre et fondant',    inStock: true,  promo: null },
]

function readProducts() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return DEFAULT_PRODUCTS
  }
}

function writeProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2))
}

// Initialiser le fichier si absent
if (!fs.existsSync(DATA_FILE)) {
  writeProducts(DEFAULT_PRODUCTS)
  console.log('products.json initialisé avec les produits par défaut')
}

// ── Middleware auth ─────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  if (req.headers['x-admin-token'] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Non autorisé' })
  }
  next()
}

// ── Routes ──────────────────────────────────────────────────────────
// Lecture publique
app.get('/api/products', (req, res) => {
  res.json(readProducts())
})

// Ajout produit
app.post('/api/products', requireAdmin, (req, res) => {
  const products = readProducts()
  const product = {
    ...req.body,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    inStock: true,
    promo: null,
  }
  products.push(product)
  writeProducts(products)
  res.json(product)
})

// Mise à jour produit (stock, promo, image...)
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const products = readProducts()
  const idx = products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Produit non trouvé' })
  products[idx] = { ...products[idx], ...req.body }
  writeProducts(products)
  res.json(products[idx])
})

// Suppression produit
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const products = readProducts()
  writeProducts(products.filter(p => p.id !== req.params.id))
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Adam Shop API démarrée sur le port ${PORT}`)
})
