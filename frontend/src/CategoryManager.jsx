import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "./api";

const emptyForm = {
    name: '',
    slug: '',
    description: '',
    status: true,
};

function CategoryManager({token}) {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const nameInputRef = useRef(null);


async function loadCategories() {
    const response = await getCategories(token);
    setCategories(response.data || []);
}

useEffect(() => {
    if (token) {
        loadCategories();
    }
}, [token]);

useEffect(() => {
    if (editingId) {
      nameInputRef.current?.focus();
    }
  }, [editingId]);

function restForm() {
    setForm(emptyForm);
    setEditingId(null);
}

function handleEdit(category) {
    setError('');
    setMessage('');
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      status: Boolean(category.status),
    });
}

async function handleSaveCategory(event) {
    event.preventDefult();
    setSaving(true);
    setError('');
    setMessage('');

    try {
        if (editingId) {
            await updateCategory(editingId, form, token);
            setMessage('Category update successfully');
        } else {
            await createCategory (form, token);
            setMessage('Category created successfully.');
        }

        restForm();
        await loadCategories();
    } catch (error) {
        setEror(error.mesage);
    } finally {
        setSaving(false);
    }
}

async function handleDelete(id) {
    setError('');
    setMessage('');
    await deleteCategory(id, token);
    setMessage('Category deleted successfull.');
    await loadCategories();
}

return (
<section className="category-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Category Management</h1>
        </div>
      </header>

      <div className="content-grid">
        <form className="panel category-form" onSubmit={handleSaveCategory}>
          <h2>{editingId ? 'Edit category' : 'Create category'}</h2>

          <label htmlFor="name">Name</label>
          <input
            id="name"
            ref={nameInputRef}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Laptops"
          />

          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            value={form.slug}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
            placeholder="laptops"
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Laptop products"
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.checked })}
            />
            Active category
          </label>

          {error && <p className="alert error">{error}</p>}
          {message && <p className="alert success">{message}</p>}

          <div className="button-row">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
            </button>
            {editingId && (
              <button type="button" className="secondary-button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="panel category-list">
          <div className="list-header">
            <h2>Categories</h2>
            <span>{categories.length} total</span>
          </div>

          {categories.map((category) => (
            <article className="category-row" key={category.id}>
              <div>
                <strong>{category.name}</strong>
                <span>{category.slug}</span>
              </div>
              <small>{category.status ? 'Active' : 'Inactive'}</small>
              <div className="row-actions">
                <button type="button" className="secondary-button" onClick={() => handleEdit(category)}>
                  Edit
                </button>
                <button type="button" className="danger-button" onClick={() => handleDelete(category.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </section>
);

}

export default CategoryManager;