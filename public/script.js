let cart = [];
let isAdmin = false;

async function fetchProducts() {
  const res = await fetch('/products');
  const products = await res.json();
  renderProducts(products);
}

function renderProducts(products) {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `<h3>${p.name}</h3>
                     <p>${p.description}</p>
                     <p>Price: $${p.price}</p>
                     <p>Stock: ${p.stock}</p>
                     <button onclick="addToCart(${p.id})">Add to Cart</button>
                     ${isAdmin ? `<button onclick="editProduct(${p.id})">Edit</button>
                                  <button onclick="deleteProduct(${p.id})">Delete</button>` : ''}`;
    list.appendChild(div);
  });
}

function addToCart(id) {
  cart.push(id);
  renderCart();
}

function renderCart() {
  const ul = document.getElementById('cart');
  ul.innerHTML = '';
  cart.forEach((id) => {
    const li = document.createElement('li');
    li.textContent = `Product ${id}`;
    ul.appendChild(li);
  });
}

function checkout() {
  alert('Checked out with items: ' + cart.join(', '));
  cart = [];
  renderCart();
}

function loginAdmin() {
  const password = document.getElementById('admin-password').value;
  if (password === 'admin123') {
    isAdmin = true;
    document.getElementById('admin-panel').style.display = 'block';
    fetchProducts();
  } else {
    alert('Wrong password!');
  }
}

async function addProduct() {
  if (!isAdmin) return;
  const name = document.getElementById('new-name').value;
  const description = document.getElementById('new-description').value;
  const price = parseFloat(document.getElementById('new-price').value);
  const stock = parseInt(document.getElementById('new-stock').value);
  
  await fetch('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price, stock })
  });
  fetchProducts();
}

async function deleteProduct(id) {
  if (!isAdmin) return;
  if (!confirm('Are you sure you want to delete this product?')) return;
  await fetch(`/products/${id}`, { method: 'DELETE' });
  fetchProducts();
}

async function editProduct(id) {
  if (!isAdmin) return;
  const name = prompt('New name:');
  const description = prompt('New description:');
  const price = parseFloat(prompt('New price:'));
  const stock = parseInt(prompt('New stock:'));
  
  if (name && description && !isNaN(price) && !isNaN(stock)) {
    await fetch(`/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, stock })
    });
    fetchProducts();
  } else {
    alert('Invalid input!');
  }
}

fetchProducts();