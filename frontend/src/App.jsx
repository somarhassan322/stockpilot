import { useState } from 'react';
import './App.css';
import Login from './Login.jsx';
import CategoryManager from './CategoryManager.jsx';
import ProductManager from './ProductManager.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [activeScreen, setActiveScreen] = useState('dashboard');

  function handleLogout() {
    localStorage.removeItem('stockpilot_token');
    setActiveScreen('dashboard');
    setUser(null);
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const isAdmin = user.role === 'admin';
  const token = localStorage.getItem('stockpilot_token');

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">SP</div>
          <div>
            <h2>StockPilot</h2>
            <p>Inventory Management</p>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          <button
            className={
              activeScreen === 'dashboard'
                ? 'nav-link active'
                : 'nav-link'
            }
            type="button"
            onClick={() => setActiveScreen('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={
              activeScreen === 'categories'
                ? 'nav-link active'
                : 'nav-link'
            }
            type="button"
            onClick={() => setActiveScreen('categories')}
          >
            Categories
          </button>

          <button
            className={
              activeScreen === 'products'
                ? 'nav-link active'
                : 'nav-link'
            }
            type="button"
            onClick={() => setActiveScreen('products')}
          >
            Products
          </button>
        </nav>
      </aside>

      <main className="main-content">
        {activeScreen === 'categories' ? (
          <CategoryManager
            token={token}
            isAdmin={isAdmin}
          />
        ) : activeScreen === 'products' ? (
          <ProductManager
            token={token}
            isAdmin={isAdmin}
          />
        ) : (
          <Dashboard
            token={token}
            user={user}
            isAdmin={isAdmin}
            onOpenProducts={() => setActiveScreen('products')}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}

export default App;