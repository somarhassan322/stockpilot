import { useEffect, useState } from 'react';
import {
  Boxes,
  DollarSign,
  Layers,
  LogOut,
  PackageCheck,
  PackagePlus,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { getCategories, getProducts } from './api';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const emptySummary = {
  categories: 0,
  products: 0,
  activeProducts: 0,
  stock: 0,
  inventoryValue: 0,
};

function Dashboard({ token, onOpenProducts, onLogout }) {
  const [summary, setSummary] = useState(emptySummary);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadDashboard() {
    setLoading(true);
    setError('');

    try {
      const [categoryResponse, productResponse] = await Promise.all([
        getCategories(token),
        getProducts(token),
      ]);

      const categories = categoryResponse.data || [];
      const products = productResponse.data || [];
      const activeProducts = products.filter((product) => product.status).length;
      const stock = products.reduce((total, product) => total + Number(product.stock || 0), 0);
      const inventoryValue = products.reduce((total, product) => {
        return total + Number(product.price || 0) * Number(product.stock || 0);
      }, 0);

      setSummary({
        categories: categories.length,
        products: products.length,
        activeProducts,
        stock,
        inventoryValue,
      });
      setRecentProducts(products.slice(0, 5));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, [token]);

  const statCards = [
    { label: 'Categories', value: summary.categories, note: 'Product groups', Icon: Layers },
    { label: 'Products', value: summary.products, note: 'Catalog items', Icon: ShoppingBag },
    { label: 'Active Products', value: summary.activeProducts, note: 'Visible in store', Icon: PackageCheck },
    { label: 'Stock Units', value: summary.stock, note: 'Total inventory', Icon: Boxes },
  ];

  return (
    <section className="dashboard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>StockPilot Overview</h1>
        </div>
        <div className="dashboard-actions">
          <button type="button" onClick={onOpenProducts}>
            <PackagePlus size={18} />
            Add Product
          </button>
          <button type="button" className="secondary-button" onClick={loadDashboard}>
            <RefreshCw size={18} />
            Refresh
          </button>
          <button type="button" className="secondary-button" onClick={onLogout}>
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </header>

      {error && <p className="alert error">{error}</p>}
      {loading && <p className="panel muted">Loading dashboard...</p>}

      <section className="dashboard-grid" aria-label="Dashboard summary">
        {statCards.map((stat) => {
          const Icon = stat.Icon;

          return (
            <article className="dashboard-card" key={stat.label}>
              <Icon size={24} />
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.note}</small>
            </article>
          );
        })}
        <article className="dashboard-card highlight-card">
          <DollarSign size={24} />
          <span>Inventory Value</span>
          <strong>{moneyFormatter.format(summary.inventoryValue)}</strong>
          <small>Based on product price and stock</small>
        </article>
      </section>

      <section className="dashboard-main-grid">
        <article className="panel recent-products-panel">
          <div className="list-header">
            <h2>Recent Products</h2>
            <span>{recentProducts.length} shown</span>
          </div>

          <div className="recent-table">
            {recentProducts.map((product) => (
              <div className="recent-row" key={product.id}>
                <strong>{product.name}</strong>
                <span>{product.category?.name || 'No category'}</span>
                <span>{moneyFormatter.format(Number(product.price || 0))}</span>
                <small>{product.stock} in stock</small>
              </div>
            ))}
          </div>
        </article>

        <aside className="panel final-note">
          <p className="eyebrow">Final polish</p>
          <h2>Full stack flow is complete</h2>
          <p>React talks to Laravel, Laravel validates and stores data, and MySQL keeps the inventory records organized.</p>
        </aside>
      </section>
    </section>
  );
}

export default Dashboard;