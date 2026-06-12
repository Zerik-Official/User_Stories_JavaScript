/**
 * @typedef {Object} Product
 * @property {number} id - Unique product identifier.
 * @property {string} nombre - Product name.
 * @property {number} precio - Product price.
 */

/** @type {Product[]} */
const products = [
  { id: 1, nombre: 'Laptop', precio: 1200 },
  { id: 2, nombre: 'Mouse', precio: 25 },
  { id: 3, nombre: 'Keyboard', precio: 75 }
];

/**
 * Validate that every product has a valid id, name, and price.
 * @param {Product[]} products - Array of products to validate.
 * @returns {boolean} True if all products are valid.
 */
function validateProducts(products) {
  return products.every(p =>
    typeof p.id === 'number' && p.id > 0 &&
    typeof p.nombre === 'string' && p.nombre.trim() !== '' &&
    typeof p.precio === 'number' && p.precio >= 0
  );
}

/** Execute all data management tasks: objects, Sets, Maps, iteration, validation. */
function runDataManagement() {
  console.log('=== Task 1: Products Object ===');
  if (!validateProducts(products)) {
    console.error('Error: One or more products have invalid data.');
    return;
  }
  console.log('Products:', products);
  for (const key in products) {
    console.log(`  [${key}] id=${products[key].id}, name=${products[key].nombre}, price=$${products[key].precio}`);
  }

  console.log('\n=== Task 2: Set Operations ===');
  const numberSet = new Set([1, 2, 2, 3, 4, 4, 5, 6, 6]);
  console.log('Set contents (duplicates removed):', [...numberSet]);
  numberSet.add(7);
  console.log('After adding 7:', [...numberSet]);
  console.log('Has 3?', numberSet.has(3));
  console.log('Has 10?', numberSet.has(10));
  numberSet.delete(2);
  console.log('After deleting 2:', [...numberSet]);
  console.log('Iterating with for...of:');
  for (const val of numberSet) {
    console.log(`  Value: ${val}`);
  }

  console.log('\n=== Task 3: Map Operations ===');
  const categoryMap = new Map();
  categoryMap.set('Electronics', 'Laptop');
  categoryMap.set('Accessories', 'Mouse');
  categoryMap.set('Accessories', 'Keyboard');
  categoryMap.set('Peripherals', 'Monitor');
  console.log('Category Map:');
  categoryMap.forEach((value, key) => {
    console.log(`  Category: ${key} -> Product: ${value}`);
  });

  console.log('\n=== Task 4: Iteration Methods ===');
  console.log('Object.keys():', Object.keys(products));
  console.log('Object.values():', Object.values(products));
  console.log('Object.entries():');
  Object.entries(products).forEach(([index, product]) => {
    console.log(`  Product ${index}: ${product.nombre} - $${product.precio}`);
  });

  console.log('\n=== Task 5: Validation Results ===');
  console.log('Complete product list:', products);
  console.log('Unique numbers:', [...numberSet]);
  console.log('Product categories and names:');
  for (const [cat, name] of categoryMap) {
    console.log(`  ${cat} -> ${name}`);
  }

  console.log('\nAll tasks completed successfully.');
}
