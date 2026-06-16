require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bilhetesRoutes = require('./src/routes/bilhetesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/bilhetes', bilhetesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
