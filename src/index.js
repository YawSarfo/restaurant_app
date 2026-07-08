import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/main.css';

import { renderNavbar }          from './components/navbar.js';
import { renderFooter }          from './components/footer.js';
import { renderHome }            from './pages/home.js';
import { renderAuth }            from './pages/auth.js';
import { renderCart }            from './pages/cart.js';
import { renderCheckout }        from './pages/checkout.js';
import { renderAdminLogin }      from './pages/admin/adminLogin.js';
import { renderAdminDashboard }  from './pages/admin/adminDashboard.js';
import { requireAdmin }          from './utils/adminAuth.js';

function router() {
  const route = window.location.hash || '#home';
  const app   = document.getElementById('app');
  const nav   = document.getElementById('navbar-root');

  if (!app || !nav) return;

  app.innerHTML = '';

  // Admin routes — no navbar or footer
  if (route.startsWith('#admin')) {
    nav.innerHTML = '';
    const existing = document.getElementById('site-footer');
    if (existing) existing.remove();

    if (route === '#admin-login') {
      renderAdminLogin(app);
    } else {
      if (!requireAdmin()) return;
      renderAdminDashboard(app);
    }
    return;
  }

  // Customer routes
  renderNavbar();

  switch (route) {
    case '#home':
      renderHome(app);
      break;
    case '#login':
    case '#register':
      renderAuth(app, route);
      break;
    case '#cart':
      renderCart(app);
      break;
    case '#checkout':
      renderCheckout(app);
      break;
    default:
      renderHome(app);
  }

  // Render footer on all customer pages
  renderFooter();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', router);
} else {
  router();
}

window.addEventListener('hashchange', router);