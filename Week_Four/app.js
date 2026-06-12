/** Base URL for the JSON Server posts API (proxied via Vite). */
const API_URL = '/api/posts';

/** @type {HTMLFormElement} */
const form = document.getElementById('product-form');
/** @type {HTMLInputElement} */
const nameInput = document.getElementById('name-input');
/** @type {HTMLInputElement} */
const priceInput = document.getElementById('price-input');
/** @type {HTMLUListElement} */
const list = document.getElementById('product-list');
/** @type {HTMLButtonElement} */
const syncBtn = document.getElementById('sync-btn');

/**
 * @typedef {Object} Product
 * @property {number} id - Unique local identifier.
 * @property {string} name - Product name.
 * @property {number} price - Product price.
 * @property {number} [apiId] - API identifier if synced.
 */

/** @type {Product[]} */
let products = [];
/** @type {number} */
let nextId = 1;

/** Load products from Local Storage and render them. */
function loadFromLocalStorage() {
  const stored = localStorage.getItem('products');
  if (stored) {
    products = JSON.parse(stored);
    nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.forEach(p => addProductToDOM(p));
    console.log(`Loaded ${products.length} products from Local Storage.`);
  }
}

/** Persist the current products array to Local Storage. */
function saveToLocalStorage() {
  localStorage.setItem('products', JSON.stringify(products));
  console.log('Products saved to Local Storage.');
}

/** Clear all products from the DOM list. */
function clearDOMList() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

/**
 * Create a DOM list item for a product and append it to the list.
 * @param {Product} product - The product to render.
 */
function addProductToDOM(product) {
  const existing = document.querySelector(`#product-list li[data-id="${product.id}"]`);
  if (existing) return;

  const li = document.createElement('li');
  li.dataset.id = product.id;
  li.className = 'flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors';

  const info = document.createElement('div');
  info.className = 'flex-1 min-w-0 mr-4';
  info.innerHTML = `
    <span class="text-gray-200 text-sm font-medium block truncate">${escapeHtml(product.name)}</span>
    <span class="text-gray-400 text-xs">$${Number(product.price).toFixed(2)}</span>
  `;

  const actions = document.createElement('div');
  actions.className = 'flex gap-2 shrink-0';

  const editBtn = document.createElement('button');
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  editBtn.className = 'px-3 py-1 text-xs bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400';
  editBtn.title = 'Edit product';

  const delBtn = document.createElement('button');
  delBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  delBtn.className = 'px-3 py-1 text-xs bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400';
  delBtn.title = 'Delete product';

  editBtn.addEventListener('click', () => editProduct(product.id));
  delBtn.addEventListener('click', () => deleteProduct(product.id));

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);
  li.appendChild(info);
  li.appendChild(actions);
  list.appendChild(li);
}

/**
 * Escape HTML special characters.
 * @param {string} str - Raw string.
 * @returns {string} Escaped string safe for innerHTML.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/** Show or hide the placeholder message based on list contents. */
function togglePlaceholder() {
  let ph = list.querySelector('.placeholder');
  if (list.children.length === 0) {
    if (!ph) {
      const p = document.createElement('li');
      p.className = 'placeholder text-gray-600 text-sm text-center py-8';
      p.innerHTML = '<i class="fa-solid fa-box-open mr-2"></i>No products yet. Add one using the form!';
      list.appendChild(p);
    }
  } else {
    if (ph) list.removeChild(ph);
  }
}

/**
 * Create a new product, add it to state and DOM, and persist.
 * @param {string} name - Product name.
 * @param {number|string} price - Product price.
 * @returns {Product} The newly created product.
 */
function addProduct(name, price) {
  const product = { id: nextId++, name, price: Number(price) };
  products.push(product);
  addProductToDOM(product);
  togglePlaceholder();
  saveToLocalStorage();
  console.log(`Added product: "${product.name}" - $${product.price}`);
  return product;
}

/**
 * Delete a product by id from state, DOM, and Local Storage.
 * @param {number} id - Product id to delete.
 */
function deleteProduct(id) {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return;
  const product = products[index];
  products.splice(index, 1);
  const li = document.querySelector(`#product-list li[data-id="${id}"]`);
  if (li) list.removeChild(li);
  togglePlaceholder();
  saveToLocalStorage();
  console.log(`Deleted product: "${product.name}"`);
}

/**
 * Populate the form with a product's data for editing and remove the original.
 * @param {number} id - Product id to edit.
 */
function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  nameInput.value = product.name;
  priceInput.value = product.price;
  products = products.filter(p => p.id !== id);
  const li = document.querySelector(`#product-list li[data-id="${id}"]`);
  if (li) list.removeChild(li);
  togglePlaceholder();
  saveToLocalStorage();
  nameInput.focus();
}

/**
 * Handle form submission: validate input and add product.
 * @param {Event} e - The submit event.
 */
function handleFormSubmit(e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const price = priceInput.value.trim();

  if (!name) {
    console.warn('Product name is required.');
    nameInput.focus();
    return;
  }
  if (!price || isNaN(Number(price)) || Number(price) < 0) {
    console.warn('Please enter a valid price.');
    priceInput.focus();
    return;
  }

  addProduct(name, price);
  form.reset();
  nameInput.focus();
}

/**
 * Fetch products from JSON Server and replace the local list.
 * Maps API post fields: title -> name, body -> price.
 */
async function syncWithAPI() {
  syncBtn.disabled = true;
  syncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i>Syncing...';
  console.log('Starting API sync...');

  try {
    const getRes = await fetch(API_URL);
    if (!getRes.ok) throw new Error(`GET failed: ${getRes.status}`);
    const apiPosts = await getRes.json();
    console.log(`GET successful: fetched ${apiPosts.length} items from API.`);

    const mapped = apiPosts.map((post, index) => ({
      id: index + 1,
      name: post.title,
      price: parseFloat(post.body.replace('$', '')) || 0,
      apiId: post.id
    }));

    products = mapped;
    nextId = products.length + 1;
    clearDOMList();
    products.forEach(p => addProductToDOM(p));
    togglePlaceholder();
    saveToLocalStorage();
    console.log(`Sync complete. ${products.length} products loaded from API.`);
  } catch (error) {
    console.error(`API sync error: ${error.message}`);
  } finally {
    syncBtn.disabled = false;
    syncBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up mr-1"></i>Sync with API';
  }
}

form.addEventListener('submit', handleFormSubmit);
syncBtn.addEventListener('click', syncWithAPI);

loadFromLocalStorage();
togglePlaceholder();
