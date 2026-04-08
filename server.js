const express = require('express');
const app = express();

// Status lives in server memory — shared across all devices
let status = { range: '10–15', color: 'green', msg: "Kitchen is running smoothly.", ts: Date.now() };
// v2

app.use(express.json());
app.use(express.static('site'));

// Guest phones poll this to get current status
app.get('/status', (req, res) => {
  res.json(status);
});

// Staff phone posts here when they update
app.post('/status', (req, res) => {
  const { range, color, msg } = req.body;
  if (!range || !color || !msg) return res.status(400).json({ error: 'Missing fields' });
  status = { range, color, msg, ts: Date.now() };
  console.log(`Status updated: ${color} — ${range} min`);
  res.json(status);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Kitchen status server running on port ${PORT}`));
