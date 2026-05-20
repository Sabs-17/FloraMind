const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const chatRoutes = require('./src/routes/chat');
const imageRoutes = require('./src/routes/image');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/api/chat', chatRoutes);
app.use('/api/images', imageRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`FloraMind backend rodando em http://localhost:${port}`);
});
