const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = 'products.json';

function loadProducts() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

app.get('/products', (req, res) => {
  res.json(loadProducts());
});

app.post('/products', (req, res) => {
  let products = loadProducts();
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  saveProducts(products);
  res.json(newProduct);
});

app.patch('/products/:id', (req, res) => {
  let products = loadProducts();
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  products[index] = { ...products[index], ...req.body };
  saveProducts(products);
  res.json(products[index]);
});

app.delete('/products/:id', (req, res) => {
  let products = loadProducts();
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  const deleted = products.splice(index, 1);
  saveProducts(products);
  res.json(deleted[0]);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));