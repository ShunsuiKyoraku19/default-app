/**
 * Servidor mínimo: recebe upload de capa (PNG ou JPG) e salva na pasta uploads/.
 * O app React Native pode enviar o arquivo quando EXPO_PUBLIC_FLUXCARR_API estiver configurada.
 */
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORTA = process.env.PORT || 3000;

const pastaUploads = path.join(__dirname, 'uploads');
if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads, { recursive: true });
}

const armazenamento = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, pastaUploads),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const sufixo = ext === '.png' || ext === '.jpg' || ext === '.jpeg' ? ext : '.jpg';
    cb(null, `capa_${Date.now()}${sufixo}`);
  },
});

function apenasPngOuJpg(_req, file, cb) {
  const permitidos = ['image/png', 'image/jpeg'];
  cb(null, permitidos.includes(file.mimetype));
}

const upload = multer({ storage: armazenamento, fileFilter: apenasPngOuJpg });

app.use(cors());
app.use('/uploads', express.static(pastaUploads));

app.post('/api/upload', upload.single('arquivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Envie o campo "arquivo" com uma imagem PNG ou JPG.' });
  }
  const caminhoPublico = `/uploads/${req.file.filename}`;
  return res.status(201).json({ caminho: caminhoPublico });
});

app.get('/', (_req, res) => {
  res.json({
    mensagem: 'FLUXCARR — API de upload',
    dica: 'POST /api/upload (multipart, campo "arquivo")',
  });
});

app.listen(PORTA, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`FLUXCARR backend em http://0.0.0.0:${PORTA}`);
});
