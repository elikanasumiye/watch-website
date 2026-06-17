const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post('/api/orders', (req, res) => {
  const fullName = String(req.body.fullName || '').trim();
  const email = String(req.body.email || '').trim();
  const contact = String(req.body.contact || '').trim();
  const location = String(req.body.location || '').trim();
  const deliveryPayment = String(req.body.deliveryPayment || '').trim();
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const total = Number(req.body.total || 0);

  if (!fullName || !email || !contact || !location || !deliveryPayment) {
    return res.status(400).json({ error: 'Tafadhali jaza taarifa zote za oda' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Muundo wa barua pepe si sahihi' });
  }

  if (!/^[0-9+\s-]{7,15}$/.test(contact)) {
    return res.status(400).json({ error: 'Namba ya mawasiliano si sahihi' });
  }

  if (items.length === 0 || total <= 0) {
    return res.status(400).json({ error: 'Kikapu chako ni tupu' });
  }

  return res.json({
    success: true,
    message: 'Oda imetumwa kikamilifu',
    order: {
      fullName,
      email,
      contact,
      location,
      deliveryPayment,
      items,
      total
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/index.php', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('*', (req, res) => {
  res.status(404).send('Haikupatikana');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
