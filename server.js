const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post('/api/orders', async (req, res) => {
  const fullName = String(req.body.fullName || '').trim();
  const email = String(req.body.email || '').trim();
  const contact = String(req.body.contact || '').trim();
  const location = String(req.body.location || '').trim();
  const deliveryPayment = String(req.body.deliveryPayment || '').trim();
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const total = Number(req.body.total || 0);
  const cleanItems = items.map(item => ({
    productId: Number(item.id || item.productId || 0),
    name: String(item.name || '').trim(),
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 0)
  }));

  if (!fullName || !email || !contact || !location || !deliveryPayment) {
    return res.status(400).json({ error: 'Tafadhali jaza taarifa zote za oda' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Muundo wa barua pepe si sahihi' });
  }

  if (!/^[0-9+\s-]{7,15}$/.test(contact)) {
    return res.status(400).json({ error: 'Namba ya mawasiliano si sahihi' });
  }

  if (cleanItems.length === 0 || total <= 0) {
    return res.status(400).json({ error: 'Kikapu chako ni tupu' });
  }

  if (cleanItems.some(item => !item.productId || !item.name || item.price <= 0 || item.quantity <= 0)) {
    return res.status(400).json({ error: 'Taarifa za bidhaa si sahihi' });
  }

  try {
    const order = await prisma.order.create({
      data: {
        fullName,
        email,
        contact,
        location,
        deliveryPayment,
        total,
        items: {
          create: cleanItems
        }
      },
      include: {
        items: true
      }
    });

    return res.json({
      success: true,
      message: 'Oda imetumwa kikamilifu',
      order
    });
  } catch (error) {
    return res.status(500).json({ error: 'Oda imeshindikana kuhifadhiwa' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ error: 'Imeshindikana kusoma oda' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/index.php', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'orders.html'));
});

app.get('*', (req, res) => {
  res.status(404).send('Haikupatikana');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
