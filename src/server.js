const express = require('express');
const { calcularPromedio } = require('./calculadora');

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/calcular', (req, res) => {
  const { parcial1, parcial2, parcial3 } = req.body;
  try {
    const resultado = calcularPromedio(parcial1, parcial2, parcial3);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
