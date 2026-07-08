import { getMenuItems } from '../utils/menu.js';
import { addToCart }    from '../utils/cart.js';
import { renderNavbar } from '../components/navbar.js';

export function renderHome(container) {
  const MENU_ITEMS = getMenuItems().filter(item => item.available);

  container.innerHTML = `
    <section class="text-white text-center py-5"
             style="background:var(--brand-dark)">
      <h1 class="display-4 fw-bold">Tasty Bat-El</h1>
      <p class="lead text-danger">Fresh. Local. Delivered to your door.</p>
      <a href="#register" class="btn btn-danger btn-lg mt-2">Order Now</a>
    </section>

    <section class="container py-5">
      <h2 class="fw-bold mb-4 text-center">Our Menu</h2>
      <div class="row g-4" id="menu-grid"></div>
    </section>`;

  const grid = document.getElementById('menu-grid');

  MENU_ITEMS.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4';
    col.innerHTML = `
      <div class="card-menu d-flex flex-column h-100">

        <!-- Food photo -->
        <div style="height:200px;overflow:hidden;background:#f0f0f0">
          <img
            src="${item.image}"
            alt="${item.name}"
            style="width:100%;height:100%;object-fit:cover;
                   display:block;transition:transform 0.3s"
            class="menu-img"
          />
        </div>

        <!-- Card body -->
        <div class="p-3 d-flex flex-column flex-grow-1">
          <span class="badge bg-secondary mb-2" style="width:fit-content">
            ${item.category}
          </span>
          <h5 class="fw-semibold mb-1">${item.name}</h5>
          <p class="text-muted small mb-3">${item.description}</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="fw-bold text-danger fs-6">
              Le ${item.price.toLocaleString()}
            </span>
            <button class="btn btn-brand btn-sm add-btn"
                    data-id="${item.id}">
              Add to Cart
            </button>
          </div>
        </div>

      </div>`;
    grid.appendChild(col);
  });

  // Hover zoom on images
  grid.querySelectorAll('.menu-img').forEach(img => {
    img.addEventListener('mouseover', () => img.style.transform = 'scale(1.05)');
    img.addEventListener('mouseout',  () => img.style.transform = 'scale(1)');
  });

  // Add to cart
  grid.addEventListener('click', e => {
    if (e.target.classList.contains('add-btn')) {
      const id   = parseInt(e.target.dataset.id);
      const item = MENU_ITEMS.find(m => m.id === id);
      addToCart(item);
      e.target.textContent = '✓ Added';
      e.target.disabled    = true;
      setTimeout(() => {
        e.target.textContent = 'Add to Cart';
        e.target.disabled    = false;
      }, 1200);
      renderNavbar();
    }
  });
}