import { useEffect, useRef, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  STORAGE_URL,
  updateProduct,
} from './api';

const emptyForm = {
  category_id: '',
  name: '',
  slug: '',
  description: '',
  price: '',
  stock: '',
  image: null,
  status: true,
};

function ProductManager({ token, isAdmin }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const nameInputRef = useRef(null);

  async function loadProductData() {
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        getProducts(token),
        getCategories(token),
      ]);

      const categoryList = categoryResponse.data || [];

      setProducts(productResponse.data || []);
      setCategories(categoryList);

      setForm((currentForm) => ({
        ...currentForm,
        category_id:
          currentForm.category_id || categoryList[0]?.id || '',
      }));
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      loadProductData();
    }
  }, [token]);

  useEffect(() => {
    if (editingId) {
      nameInputRef.current?.focus();
    }
  }, [editingId]);

  function resetForm() {
    setForm({
      ...emptyForm,
      category_id: categories[0]?.id || '',
    });
    setEditingId(null);
  }

  function buildProductFormData() {
    const productData = new FormData();

    productData.append('category_id', form.category_id);
    productData.append('name', form.name);
    productData.append('slug', form.slug);
    productData.append('description', form.description);
    productData.append('price', form.price);
    productData.append('stock', form.stock);
    productData.append('status', form.status ? '1' : '0');

    if (form.image) {
      productData.append('image', form.image);
    }

    return productData;
  }

  function handleEdit(product) {
    setError('');
    setMessage('');
    setEditingId(product.id);

    setForm({
      category_id: product.category_id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      image: null,
      status: Boolean(product.status),
    });
  }

  async function handleSaveProduct(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const productData = buildProductFormData();

      if (editingId) {
        await updateProduct(editingId, productData, token);
        setMessage('Product updated successfully.');
      } else {
        await createProduct(productData, token);
        setMessage('Product created successfully.');
      }

      resetForm();
      await loadProductData();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setError('');
    setMessage('');

    try {
      await deleteProduct(id, token);
      setMessage('Product deleted successfully.');
      await loadProductData();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="product-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Product Management</h1>
        </div>
      </header>

      {error && <p className="alert error">{error}</p>}
      {message && <p className="alert success">{message}</p>}

      <div className="content-grid product-grid">
        {isAdmin && (
          <form
            className="panel category-form product-form"
            onSubmit={handleSaveProduct}
          >
            <h2>{editingId ? 'Edit product' : 'Create product'}</h2>

            <label htmlFor="category_id">Category</label>
            <select
              id="category_id"
              value={form.category_id}
              onChange={(event) =>
                setForm({
                  ...form,
                  category_id: event.target.value,
                })
              }
              required
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <label htmlFor="product_name">Name</label>
            <input
              id="product_name"
              ref={nameInputRef}
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
              placeholder="Wireless Mouse"
              required
            />

            <label htmlFor="product_slug">Slug</label>
            <input
              id="product_slug"
              value={form.slug}
              onChange={(event) =>
                setForm({
                  ...form,
                  slug: event.target.value,
                })
              }
              placeholder="wireless-mouse"
              required
            />

            <label htmlFor="product_description">Description</label>
            <textarea
              id="product_description"
              value={form.description}
              onChange={(event) =>
                setForm({
                  ...form,
                  description: event.target.value,
                })
              }
              placeholder="Compact wireless mouse"
            />

            <div className="form-row">
              <div>
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      price: event.target.value,
                    })
                  }
                  placeholder="49.99"
                  required
                />
              </div>

              <div>
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      stock: event.target.value,
                    })
                  }
                  placeholder="30"
                  required
                />
              </div>
            </div>

            <label htmlFor="image">Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(event) =>
                setForm({
                  ...form,
                  image: event.target.files?.[0] || null,
                })
              }
            />

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.checked,
                  })
                }
              />
              Active product
            </label>

            <div className="button-row">
              <button type="submit" disabled={saving}>
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Product'
                    : 'Create Product'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        <section className="panel product-list">
          <div className="list-header">
            <h2>Products</h2>
            <span>{products.length} total</span>
          </div>

          {products.length === 0 ? (
            <p className="muted">No products found.</p>
          ) : (
            products.map((product) => (
              <article className="product-row" key={product.id}>
                <div className="product-info">
                  <div className="product-thumb">
                    {product.image ? (
                      <img
                        src={`${STORAGE_URL}/${product.image}`}
                        alt={product.name}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </div>

                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.category?.name || 'Uncategorized'}</span>
                  </div>
                </div>

                <div className="price-stock">
                  <span>${product.price}</span>
                  <small>{product.stock} in stock</small>
                </div>

                {isAdmin && (
                  <div className="row-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </section>
      </div>
    </section>
  );
}

export default ProductManager;