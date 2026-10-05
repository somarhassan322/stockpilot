import { useState } from 'react';
import { loginAdmin } from './api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginAdmin({
        email,
        password,
      });

      localStorage.setItem('stockpilot_token', response.token);
      onLogin(response.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-row login-brand">
          <div className="brand-logo">SP</div>

          <div>
            <p className="eyebrow">StockPilot</p>
            <h1>Login to dashboard</h1>
          </div>
        </div>

        <p className="muted">
          Sign in to manage your inventory, products, and categories.
        </p>

        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="email">Email Address</label>

          <input
            autoFocus
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="alert error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;