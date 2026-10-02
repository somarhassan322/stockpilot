import { useState } from 'react';
import './App.css'
import Login from './Login.jsx';
import CategoryManager from './CategoryManager.jsx'
import ProductManager from './ProductManager.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [activeScreen, setActiveScreen] = useState('dashcoard');

  function handleLogout() {
    localStorage.removeItem('admin_token');
    setActiveScreen('dashboard');
    setUser(null);
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }
  return (
      <div className="admin-layout">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-logo">LW</div>
            <div>
            <h2>Learn Admin</h2>
            <p>Stock Pilot</p>
            </div>
          </div>

          <nav className="nav-list" aria-label='Admin navigation'>
            <button className={activeScreen === 'dashboard' ? 'nav-link active' : 'nav-link'}
            type='buton'
            on onClick={() => setActiveScreen('dashboard')}> Dashboard </button>
            <button className={activeScreen === 'categories' ? 'nav-link active' : 'nav-link'}
            type='buton'
            on onClick={() => setActiveScreen('categories')}> Categories </button>
            <button className={activeScreen === 'products' ? 'nav-link active' : 'nav-link'}
            type='buton'
            on onClick={() => setActiveScreen('Products')}> Products </button>
          </nav>
        </aside>

        <main className="main-content">
          {activeScreen === 'categories' ? (
            <CategoryManager token={localStorage.getItem('admin_token')} />
          ) : activeScreen === 'products' ? (
            <ProductManager token={localStorage.getItem('admin_token')} />
          ) : (
            <Dashboard
              token={localStorage.getItem('admin_token')}
              onOpenProducts={() => setActiveScreen('products')}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>
  )
}

export default App
