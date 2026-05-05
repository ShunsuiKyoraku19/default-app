/**
 * API FLUXCARR — Express + TypeScript + SQLite + Drizzle
 * Mantém POST /api/upload (multer) e expõe CRUD de UF, Cidade e Usuário.
 */
import cors from 'cors';
import express, { type Request } from 'express';
import type { FileFilterCallback } from 'multer';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { initDbAndSeed } from './db/initDb';
import { authRouter } from './routes/auth';
import { cidadesRouter } from './routes/cidades';
import { ufsRouter } from './routes/ufs';
import { usuariosRouter } from './routes/usuarios';

initDbAndSeed();

const app = express();
const PORTA = Number(process.env.PORT) || 3000;

const pastaUploads = path.join(process.cwd(), 'uploads');
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

function apenasPngOuJpg(_req: Request, file: { mimetype: string }, cb: FileFilterCallback) {
  const permitidos = ['image/png', 'image/jpeg'];
  cb(null, permitidos.includes(file.mimetype));
}

const upload = multer({ storage: armazenamento, fileFilter: apenasPngOuJpg });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(pastaUploads));

app.post('/api/upload', upload.single('arquivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Envie o campo "arquivo" com uma imagem PNG ou JPG.' });
  }
  const caminhoPublico = `/uploads/${req.file.filename}`;
  return res.status(201).json({ caminho: caminhoPublico });
});

app.use('/ufs', ufsRouter);
app.use('/cidades', cidadesRouter);
app.use('/usuarios', usuariosRouter);
app.use('/auth', authRouter);

app.get('/', (_req, res) => {
  res.json({
    mensagem: 'FLUXCARR API',
    rotas: [
      'POST /api/upload',
      'GET/POST /ufs',
      'GET/PUT/DELETE /ufs/:id',
      'GET /cidades?ufId=',
      'GET/POST /cidades',
      'GET/PUT/DELETE /cidades/:id',
      'GET/POST /usuarios',
      'GET/PUT/DELETE /usuarios/:id',
      'POST /auth/login',
    ],
  });
});

app.listen(PORTA, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`FLUXCARR backend (TS+Drizzle) em http://0.0.0.0:${PORTA}`);
});
