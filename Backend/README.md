# FLUXCARR — Backend (opcional)

API mínima em Node.js para **receber imagens de capa** (somente **PNG** ou **JPG**) e gravar na pasta `uploads/`.

O trabalho principal da disciplina usa **SQLite no aplicativo**. Este servidor existe para quem quiser testar upload pela rede.

## Como rodar

```bash
cd backend
npm install
npm start
```

Por padrão o servidor sobe na porta **3000**.

## Testar upload

Com o servidor rodando, envie um `multipart/form-data` com o campo **`arquivo`**:

- Tipos aceitos: `image/png`, `image/jpeg`

Resposta de sucesso (201):

```json
{ "caminho": "/uploads/capa_1234567890.jpg" }
```

A imagem fica acessível em `http://SEU_IP:3000/uploads/...`.

## Ligar o app a este backend

No arquivo `frontend/app.json`, dentro de `expo`, configure:

```json
"extra": {
  "fluxcarrApiUrl": "http://192.168.x.x:3000"
}
```

Use o **IP da sua máquina na rede Wi‑Fi** (no celular com Expo Go, `localhost` não aponta para o seu PC).

Com a URL preenchida, o app tenta enviar a capa ao publicar/editar notícia. Se o servidor estiver desligado, o app continua salvando a **URI local** no SQLite.
