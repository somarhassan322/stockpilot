export const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const STORAGE_URL = API_URL.replace(/\/api$/, '/storage');

async function apiRequest(path, options = {}) {
  const token = options.token;
  const isFormData = options.body instanceof FormData;

  const headers = {
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export function loginAdmin(credentials) {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function getCategories(token) {
  return apiRequest('/categories', {
    token,
  });
}

export function createCategory(category, token) {
  return apiRequest('/categories', {
    method: 'POST',
    token,
    body: JSON.stringify(category),
  });
}

export function updateCategory(id, category, token) {
  return apiRequest(`/categories/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(category),
  });
}

export function deleteCategory(id, token) {
  return apiRequest(`/categories/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function getProducts(token) {
  return apiRequest('/products', {
    token,
  });
}

export function createProduct(product, token) {
  return apiRequest('/products', {
    method: 'POST',
    token,
    body: product,
  });
}

export function updateProduct(id, product, token) {
  product.append('_method', 'PUT');

  return apiRequest(`/products/${id}`, {
    method: 'POST',
    token,
    body: product,
  });
}

export function deleteProduct(id, token) {
  return apiRequest(`/products/${id}`, {
    method: 'DELETE',
    token,
  });
}