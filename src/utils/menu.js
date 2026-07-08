import jollofImg     from '../images/jollof-rice.jpg';
import fishImg       from '../images/grilled-fish.jpg';
import pepperImg     from '../images/pepper-soup.jpg';
import plantainImg   from '../images/fried-plantain.jpg';
import juiceImg      from '../images/fruit-juice.jpg';
import iceCreamImg   from '../images/ice-cream.jpg';
import egusiImg      from '../images/egusi-soup.jpg';
import meatPieImg    from '../images/meat-pie.jpg';

const MENU_KEY = 'menuItems';

const DEFAULT_MENU = [
  { id: 1, name: 'Jollof Rice & Chicken', price: 35000, category: 'Mains',    image: jollofImg,   available: true, description: 'Slow-cooked jollof rice with grilled chicken.' },
  { id: 2, name: 'Grilled Fish Platter',  price: 45000, category: 'Mains',    image: fishImg,     available: true, description: 'Fresh fish grilled with herbs.' },
  { id: 3, name: 'Pepper Soup',           price: 25000, category: 'Starters', image: pepperImg,   available: true, description: 'Spicy broth with assorted meat.' },
  { id: 4, name: 'Fried Plantain',        price: 15000, category: 'Sides',    image: plantainImg, available: true, description: 'Golden-fried sweet plantain slices.' },
  { id: 5, name: 'Fruit Juice',           price: 12000, category: 'Drinks',   image: juiceImg,    available: true, description: 'Freshly blended seasonal fruits.' },
  { id: 6, name: 'Ice Cream',             price: 18000, category: 'Desserts', image: iceCreamImg, available: true, description: 'Two scoops of vanilla or chocolate.' },
  { id: 7, name: 'Egusi Soup & Fufu',     price: 30000, category: 'Mains',    image: egusiImg,    available: true, description: 'Rich egusi soup with pounded fufu.' },
  { id: 8, name: 'Meat Pie',             price: 8000,  category: 'Starters', image: meatPieImg,  available: true, description: 'Flaky pastry with spiced minced meat.' },
];

export function getMenuItems() {
  // Always return DEFAULT_MENU so images (imported at build time) are always fresh
  return DEFAULT_MENU;
}

export function saveMenuItems(items) {
  localStorage.setItem(MENU_KEY, JSON.stringify(items));
}

export function addMenuItem(item) {
  const items = getMenuItems();
  const newItem = { ...item, id: Date.now(), available: true };
  items.push(newItem);
  saveMenuItems(items);
  return newItem;
}

export function updateMenuItem(id, updates) {
  const stored = JSON.parse(localStorage.getItem(MENU_KEY) || '[]');
  const base   = getMenuItems();
  // Merge stored overrides on top of base (preserves image references)
  const merged = base.map(item => {
    const override = stored.find(s => s.id === item.id);
    return override ? { ...item, ...override, image: item.image } : item;
  });
  const index = merged.findIndex(i => i.id === id);
  if (index === -1) return null;
  merged[index] = { ...merged[index], ...updates, image: merged[index].image };
  saveMenuItems(merged);
  return merged[index];
}

export function deleteMenuItem(id) {
  const stored = JSON.parse(localStorage.getItem(MENU_KEY) || 'null');
  const base   = stored || getMenuItems();
  saveMenuItems(base.filter(i => i.id !== id));
}

export const CATEGORIES = ['Starters', 'Mains', 'Sides', 'Desserts', 'Drinks'];