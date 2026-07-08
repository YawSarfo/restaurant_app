export function renderFooter() {
  const existing = document.getElementById('site-footer');
  if (existing) existing.remove();

  const footer = document.createElement('footer');
  footer.id = 'site-footer';
  footer.innerHTML = `
    <div style="background:#111;color:#ccc;padding:4rem 0 0">

      <!-- Top section: 3 columns -->
      <div style="max-width:1100px;margin:0 auto;padding:0 1.5rem;
                  display:grid;
                  grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
                  gap:3rem;padding-bottom:3rem">

        <!-- Column 1: Brand -->
        <div>
          <div style="font-size:1.5rem;font-weight:800;color:#fff;
                      margin-bottom:0.75rem;letter-spacing:-0.5px">
            🍽️ Tasty Bat-El
          </div>
          <p style="font-size:0.88rem;line-height:1.7;color:#888;margin:0 0 1.25rem">
            Bringing the best of local flavours to your door.
            Fresh ingredients, bold recipes, fast delivery.
          </p>
          <!-- Social links -->
          <div style="display:flex;gap:0.75rem">
            ${socialLink('Facebook',  'f', 'https://facebook.com')}
            ${socialLink('Instagram', '📷', 'https://instagram.com')}
            ${socialLink('WhatsApp',  '💬', 'https://wa.me/')}
          </div>
        </div>

        <!-- Column 2: Quick links + opening hours -->
        <div>
          <h4 style="color:#fff;font-size:0.8rem;font-weight:700;
                     text-transform:uppercase;letter-spacing:1.5px;
                     margin:0 0 1rem">Quick Links</h4>
          <ul style="list-style:none;padding:0;margin:0 0 1.75rem;
                     display:flex;flex-direction:column;gap:0.5rem">
            ${footerLink('#home',     'Menu')}
            ${footerLink('#register', 'Create Account')}
            ${footerLink('#login',    'Sign In')}
            ${footerLink('#cart',     'My Cart')}
          </ul>

          <h4 style="color:#fff;font-size:0.8rem;font-weight:700;
                     text-transform:uppercase;letter-spacing:1.5px;
                     margin:0 0 1rem">Opening Hours</h4>
          <ul style="list-style:none;padding:0;margin:0;
                     display:flex;flex-direction:column;gap:0.4rem;
                     font-size:0.85rem;color:#888">
            <li style="display:flex;justify-content:space-between">
              <span>Mon – Fri</span>
              <span style="color:#ccc">8:00 AM – 9:00 PM</span>
            </li>
            <li style="display:flex;justify-content:space-between">
              <span>Saturday</span>
              <span style="color:#ccc">9:00 AM – 10:00 PM</span>
            </li>
            <li style="display:flex;justify-content:space-between">
              <span>Sunday</span>
              <span style="color:#ccc">10:00 AM – 8:00 PM</span>
            </li>
          </ul>
        </div>

        <!-- Column 3: Contact form -->
        <div>
          <h4 style="color:#fff;font-size:0.8rem;font-weight:700;
                     text-transform:uppercase;letter-spacing:1.5px;
                     margin:0 0 1rem">Send Us a Message</h4>

          <div style="display:flex;flex-direction:column;gap:0.65rem"
               id="contact-form">

            <input id="contact-name"
                   type="text"
                   placeholder="Your name"
                   style="${inputStyle}" />

            <input id="contact-email"
                   type="email"
                   placeholder="your@email.com"
                   style="${inputStyle}" />

            <input id="contact-subject"
                   type="text"
                   placeholder="Subject (e.g. Reservation, Feedback)"
                   style="${inputStyle}" />

            <textarea id="contact-message"
                      rows="4"
                      placeholder="Write your message here…"
                      style="${inputStyle}resize:vertical;min-height:100px;
                             font-family:inherit"></textarea>

            <div id="contact-error"
                 style="display:none;color:#e74c3c;font-size:0.8rem;
                        background:rgba(231,76,60,0.1);border-radius:6px;
                        padding:0.5rem 0.75rem">
            </div>

            <div id="contact-success"
                 style="display:none;color:#2ecc71;font-size:0.85rem;
                        background:rgba(46,204,113,0.1);border-radius:6px;
                        padding:0.65rem 0.75rem;text-align:center">
              ✅ Message sent! We'll get back to you soon.
            </div>

            <button id="contact-send-btn"
                    style="background:#C0392B;color:#fff;border:none;
                           border-radius:8px;padding:0.7rem 1rem;
                           font-size:0.9rem;font-weight:600;cursor:pointer;
                           transition:background 0.2s;margin-top:0.25rem">
              Send Message
            </button>

          </div>
        </div>

      </div>

      <!-- Contact info bar -->
      <div style="border-top:1px solid #1f1f1f;padding:1.5rem 0">
        <div style="max-width:1100px;margin:0 auto;padding:0 1.5rem;
                    display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
          ${contactInfo('📍', '14 Wilkinson Road, Freetown, Sierra Leone')}
          ${contactInfo('📞', '+232 88212992')}
          ${contactInfo('✉️', 'steve@tastybatel.com')}
        </div>
      </div>

      <!-- Bottom bar -->
      <div style="border-top:1px solid #1f1f1f;padding:1.25rem 0">
        <div style="max-width:1100px;margin:0 auto;padding:0 1.5rem;
                    display:flex;flex-wrap:wrap;justify-content:space-between;
                    align-items:center;gap:0.75rem">
          <span style="font-size:0.78rem;color:#555">
            © ${new Date().getFullYear()} Tasty Bat-El. All rights reserved.
          </span>
          <span style="font-size:0.78rem;color:#555">
            Built with ❤️ in Freetown
          </span>
        </div>
      </div>

    </div>`;

  document.body.appendChild(footer);
  attachContactFormHandler();
}

// ── Helpers ──────────────────────────────────────────────

const inputStyle = `
  width:100%;background:#1a1a1a;border:1px solid #2a2a2a;
  border-radius:7px;color:#eee;padding:0.6rem 0.85rem;
  font-size:0.85rem;outline:none;box-sizing:border-box;
  transition:border-color 0.2s;`;

function footerLink(href, label) {
  return `
    <li>
      <a href="${href}"
         style="color:#888;text-decoration:none;font-size:0.88rem;
                transition:color 0.2s"
         onmouseover="this.style.color='#C0392B'"
         onmouseout="this.style.color='#888'">
        → ${label}
      </a>
    </li>`;
}

function socialLink(label, icon, href) {
  return `
    <a href="${href}"
       target="_blank"
       rel="noopener noreferrer"
       title="${label}"
       style="width:36px;height:36px;border-radius:8px;
              border:1px solid #2a2a2a;display:flex;
              align-items:center;justify-content:center;
              color:#888;text-decoration:none;font-size:0.9rem;
              transition:border-color 0.2s,color 0.2s"
       onmouseover="this.style.borderColor='#C0392B';this.style.color='#C0392B'"
       onmouseout="this.style.borderColor='#2a2a2a';this.style.color='#888'">
      ${icon}
    </a>`;
}

function contactInfo(icon, text) {
  return `
    <div style="display:flex;align-items:center;gap:0.5rem;
                font-size:0.83rem;color:#777">
      <span>${icon}</span>
      <span>${text}</span>
    </div>`;
}

function attachContactFormHandler() {
  // Add focus glow to inputs
  document.querySelectorAll('#contact-form input, #contact-form textarea')
    .forEach(el => {
      el.addEventListener('focus', () => el.style.borderColor = '#C0392B');
      el.addEventListener('blur',  () => el.style.borderColor = '#2a2a2a');
    });

  document.getElementById('contact-send-btn')
    ?.addEventListener('click', handleContactSubmit);
}

function handleContactSubmit() {
  const name    = document.getElementById('contact-name')?.value.trim();
  const email   = document.getElementById('contact-email')?.value.trim();
  const subject = document.getElementById('contact-subject')?.value.trim();
  const message = document.getElementById('contact-message')?.value.trim();

  const errorEl   = document.getElementById('contact-error');
  const successEl = document.getElementById('contact-success');
  const sendBtn   = document.getElementById('contact-send-btn');

  // Reset state
  errorEl.style.display   = 'none';
  successEl.style.display = 'none';

  // Validate
  if (!name || !email || !subject || !message) {
    errorEl.textContent    = 'Please fill in all fields before sending.';
    errorEl.style.display  = 'block';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorEl.textContent   = 'Please enter a valid email address.';
    errorEl.style.display = 'block';
    return;
  }

  // Save message to localStorage
  const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  messages.push({
    id:      Date.now(),
    name,
    email,
    subject,
    message,
    date:    new Date().toLocaleString(),
    read:    false,
  });
  localStorage.setItem('contactMessages', JSON.stringify(messages));

  // Show success state
  sendBtn.textContent      = '✓ Sent!';
  sendBtn.style.background = '#198754';
  sendBtn.disabled         = true;
  successEl.style.display  = 'block';

  // Clear form fields
  document.getElementById('contact-name').value    = '';
  document.getElementById('contact-email').value   = '';
  document.getElementById('contact-subject').value = '';
  document.getElementById('contact-message').value = '';

  // Reset button after 3 seconds
  setTimeout(() => {
    sendBtn.textContent      = 'Send Message';
    sendBtn.style.background = '#C0392B';
    sendBtn.disabled         = false;
    successEl.style.display  = 'none';
  }, 3000);
}