import { getMessages, markMessageRead, deleteMessage, getUnreadCount }
  from '../../utils/messages.js';

export function renderAdminMessages(container) {
  function render() {
    const messages = getMessages();
    const unread   = getUnreadCount();

    container.innerHTML = `
      <h2 style="font-size:1.6rem;font-weight:700;color:#1a1a1a;margin:0 0 0.25rem">
        Messages
      </h2>
      <p style="color:#888;font-size:0.85rem;margin:0 0 1.5rem">
        ${messages.length} total
        ${unread > 0
          ? `· <span style="color:#C0392B;font-weight:600">${unread} unread</span>`
          : '· all read'}
      </p>

      <div style="display:flex;flex-direction:column;gap:0.85rem;max-width:750px">
        ${messages.length === 0
          ? `<div style="background:#fff;border:1px solid #eee;border-radius:12px;
                         padding:3rem;text-align:center;color:#aaa">
               <div style="font-size:2.5rem">✉️</div>
               <p style="margin:0.75rem 0 0">No messages yet.</p>
             </div>`
          : messages.map(m => messageCard(m)).join('')}
      </div>`;

    // Mark as read
    container.querySelectorAll('.mark-read-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        markMessageRead(parseInt(btn.dataset.id));
        render();
      });
    });

    // Delete
    container.querySelectorAll('.delete-msg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this message?')) {
          deleteMessage(parseInt(btn.dataset.id));
          render();
        }
      });
    });

    // Expand / collapse message body
    container.querySelectorAll('.msg-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const body = container.querySelector(
          `.msg-body[data-id="${btn.dataset.id}"]`
        );
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'block' : 'none';
        btn.textContent    = isHidden ? '▲ Collapse' : '▼ Read message';
      });
    });
  }

  render();
}

function messageCard(m) {
  return `
    <div style="background:#fff;border:1px solid ${m.read ? '#eee' : '#C0392B33'};
                border-radius:12px;overflow:hidden">

      <!-- Header -->
      <div style="display:flex;align-items:flex-start;flex-wrap:wrap;
                  gap:0.5rem 1rem;padding:1rem 1.25rem;
                  background:${m.read ? '#fafafa' : '#fff8f7'}">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap">
            ${!m.read
              ? `<span style="background:#C0392B;color:#fff;font-size:0.65rem;
                              font-weight:700;padding:2px 8px;border-radius:10px;
                              text-transform:uppercase;letter-spacing:0.5px">
                   New
                 </span>`
              : ''}
            <span style="font-weight:700;color:#1a1a1a;font-size:0.92rem">
              ${m.name}
            </span>
            <span style="color:#aaa;font-size:0.78rem">${m.email}</span>
          </div>
          <div style="font-size:0.88rem;color:#444;margin-top:0.25rem;
                      font-weight:${m.read ? '400' : '600'}">
            ${m.subject}
          </div>
        </div>
        <span style="color:#aaa;font-size:0.75rem;white-space:nowrap;
                     flex-shrink:0">
          ${m.date}
        </span>
      </div>

      <!-- Expandable body -->
      <div class="msg-body" data-id="${m.id}"
           style="display:none;padding:1rem 1.25rem;border-top:1px solid #f0f0f0;
                  font-size:0.88rem;color:#444;line-height:1.7;
                  white-space:pre-wrap">
        ${m.message}
      </div>

      <!-- Actions -->
      <div style="display:flex;align-items:center;flex-wrap:wrap;gap:0.6rem;
                  padding:0.75rem 1.25rem;border-top:1px solid #f0f0f0">
        <button class="msg-toggle" data-id="${m.id}"
                style="background:none;border:1px solid #ddd;border-radius:6px;
                       padding:0.3rem 0.75rem;font-size:0.8rem;
                       color:#555;cursor:pointer">
          ▼ Read message
        </button>

        ${!m.read
          ? `<button class="mark-read-btn" data-id="${m.id}"
                     style="background:none;border:1px solid #ddd;border-radius:6px;
                            padding:0.3rem 0.75rem;font-size:0.8rem;
                            color:#198754;cursor:pointer">
               ✓ Mark as read
             </button>`
          : ''}

        <a href="mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}"
           style="background:#f0f4ff;color:#0d6efd;border:none;border-radius:6px;
                  padding:0.3rem 0.75rem;font-size:0.8rem;font-weight:600;
                  text-decoration:none;display:inline-block">
          ✉️ Reply by Email
        </a>

        <button class="delete-msg-btn" data-id="${m.id}"
                style="margin-left:auto;background:#fff0f0;color:#C0392B;
                       border:none;border-radius:6px;padding:0.3rem 0.65rem;
                       font-size:0.8rem;cursor:pointer">
          🗑️ Delete
        </button>
      </div>

    </div>`;
}