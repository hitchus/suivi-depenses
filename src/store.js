const STORAGE_KEY = 'adam_shop_products';

const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'Glace Vanille',
    emoji: '🍦',
    price: 1.5,
    category: 'glace',
    description: 'Douce glace à la vanille',
    inStock: true,
    promo: null,
  },
  {
    id: '2',
    name: 'Glace Chocolat',
    emoji: '🍫',
    price: 1.5,
    category: 'glace',
    description: 'Glace au chocolat fondant',
    inStock: true,
    promo: { discount: 20 },
  },
  {
    id: '3',
    name: 'Glace Fraise',
    emoji: '🍓',
    price: 1.5,
    category: 'glace',
    description: 'Glace à la fraise fraîche',
    inStock: false,
    promo: null,
  },
  {
    id: '4',
    name: 'Bonbons Oursons',
    emoji: '🐻',
    price: 0.5,
    category: 'friandise',
    description: 'Petits oursons gélifiés',
    inStock: true,
    promo: null,
  },
  {
    id: '5',
    name: 'Chewing-gum',
    emoji: '🫧',
    price: 0.3,
    category: 'friandise',
    description: 'Chewing-gum fruité',
    inStock: true,
    promo: { discount: 10 },
  },
  {
    id: '6',
    name: 'Sucette Arc-en-ciel',
    emoji: '🍭',
    price: 0.5,
    category: 'friandise',
    description: 'Sucette colorée et sucrée',
    inStock: true,
    promo: null,
  },
  {
    id: '7',
    name: 'Esquimau Chocolat',
    emoji: '🍡',
    price: 2.0,
    category: 'glace',
    description: 'Esquimau enrobé de chocolat',
    inStock: false,
    promo: null,
  },
  {
    id: '8',
    name: 'Caramel Mou',
    emoji: '🍬',
    price: 0.3,
    category: 'friandise',
    description: 'Caramel tendre et fondant',
    inStock: true,
    promo: null,
  },
];

export function loadProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
