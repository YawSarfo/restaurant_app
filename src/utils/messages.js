const KEY = 'contactMessages';

export function getMessages() {
  return JSON.parse(localStorage.getItem(KEY) || '[]').reverse();
}

export function markMessageRead(id) {
  const messages = JSON.parse(localStorage.getItem(KEY) || '[]');
  const index    = messages.findIndex(m => m.id === id);
  if (index !== -1) {
    messages[index].read = true;
    localStorage.setItem(KEY, JSON.stringify(messages));
  }
}

export function deleteMessage(id) {
  const updated = JSON.parse(localStorage.getItem(KEY) || '[]')
    .filter(m => m.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getUnreadCount() {
  return JSON.parse(localStorage.getItem(KEY) || '[]')
    .filter(m => !m.read).length;
}