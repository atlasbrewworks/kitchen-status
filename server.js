// v3
const express = require('express');
const app = express();

let status = { range: '10–15', color: 'green', msg: "Kitchen is running smoothly.", ts: Date.now() };

app.use(express.json());
app.use(express.static('site'));

app.get('/status', (req, res) => res.json(status));

app.post('/status', (req, res) => {
  const { range, color, msg } = req.body;
  if (!range || !color || !msg) return res.status(400).json({ error: 'Missing fields' });
  status = { range, color, msg, ts: Date.now() };
  console.log(`Status updated: ${color} — ${range} min`);
  res.json(status);
});

// Reset to green at 1am every night
function scheduleReset() {
  const now = new Date();
  const next1am = new Date();
  next1am.setHours(1, 0, 0, 0);
  if (next1am <= now) next1am.setDate(next1am.getDate() + 1);
  const msUntil1am = next1am - now;

  setTimeout(function reset() {
    status = {
      range: '10–15',
      color: 'green',
      msg: "Kitchen is running smoothly.",
      ts: Date.now()
    };
    console.log('Auto-reset to green at 1am');
    setTimeout(reset, 24 * 60 * 60 * 1000); // repeat every 24h
  }, msUntil1am);

  console.log(`Next auto-reset in ${Math.round(msUntil1am / 60000)} minutes`);
}

scheduleReset();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Kitchen status server running on port ${PORT}`));
