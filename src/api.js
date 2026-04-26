let adminToken = null

export function setAdminToken(token) {
  adminToken = token
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  if (adminToken) headers['X-Admin-Token'] = adminToken

  const res = await fetch('/api' + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `Erreur ${res.status}`)
  }
  return res.json()
}

export const getProducts    = ()         => request('GET',    '/products')
export const addProduct     = (data)     => request('POST',   '/products', data)
export const updateProduct  = (id, data) => request('PUT',    `/products/${id}`, data)
export const deleteProduct  = (id)       => request('DELETE', `/products/${id}`)

export const placeOrder     = (data)     => request('POST',   '/orders', data)
export const getOrders      = ()         => request('GET',    '/orders')
export const updateOrder    = (id, data) => request('PUT',    `/orders/${id}`, data)
export const deleteOrder    = (id)       => request('DELETE', `/orders/${id}`)
