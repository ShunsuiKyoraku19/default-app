# FLUXCARR

Aplicativo mobile de **marketplace automotivo** (oficinas, agendamentos e notícias), desenvolvido para disciplina com **React Native (Expo)**, **TypeScript**, **SQLite local** e **AsyncStorage** para sessão.

O **CRUD obrigatório** da atividade é o da entidade **notícia** (criar, listar, detalhar, editar e excluir com confirmação). Login, cadastro, home, busca, agendamentos e perfil são telas complementares para montar o fluxo do app.

## Tecnologias

- **Frontend:** Expo, React Native, TypeScript, expo-sqlite, AsyncStorage, React Navigation, expo-image-picker
- **Backend (opcional):** Node.js, Express, Multer (upload PNG/JPG)

## Estrutura de pastas

```
FLUXCARR/
  frontend/     → app Expo
  backend/      → API simples de upload (opcional)
  README.md     → este arquivo
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) (LTS recomendado)
- App **Expo Go** no celular (Android ou iOS)

## Instalação e execução (frontend)

```bash
cd frontend
npm install
npx expo start
```

Depois escaneie o QR code com o Expo Go (Android) ou a câmera (iOS).

### Administrador padrão (SQLite)

Na primeira execução o app cria automaticamente:

| Campo | Valor |
|--------|--------|
| Email | `admin@fluxcarr.com` |
| Senha | `123456` |
| Tipo | `administrador` |

Usuários criados pela tela de **cadastro** entram como **cliente**.

### Testar cadastro e login

1. Abra o app → **Criar conta** → preencha os dados → modal **Cadastro realizado!** → **Entrar agora** leva ao login.
2. Faça login com o novo email e senha (aba **Notícias** como cliente: só leitura).
3. Faça logout em **Perfil** → **Sair**.

### Testar CRUD de notícias (administrador)

1. Entre com `admin@fluxcarr.com` / `123456`.
2. Aba **Notícias** → **Gerenciar notícias**.
3. **+ Adicionar nova notícia** → preencher → **Publicar notícia**.
4. No card, use **lápis** (editar) ou **lixeira** (modal de exclusão).

### Cliente lendo notícias

1. Entre como cliente (cadastro novo ou outro usuário).
2. Aba **Notícias** → filtros e cards → **Ler mais** abre o detalhe.

## Expo Go

O frontend está em **Expo SDK 54** (compatível com o **Expo Go** atual da loja).

1. Instale **Expo Go** na loja de aplicativos.
2. Com `npx expo start`, use o mesmo Wi‑Fi do computador.
3. Android: abra o Expo Go e leia o QR code. iOS: Câmera nativa ou Expo Go.

## Backend opcional (upload de imagem)

```bash
cd backend
npm install
npm start
```

Para o app enviar a capa ao servidor, preencha em `frontend/app.json` o campo:

`expo.extra.fluxcarrApiUrl` → por exemplo `"http://192.168.0.15:3000"` (IP da sua máquina).

Se deixar vazio, as imagens continuam apenas como **URI local** gravada no SQLite.

## Integrantes do grupo

- Nome 1: ___________________________
- Nome 2: ___________________________
- Nome 3: ___________________________

## Licença

Projeto acadêmico — uso educacional.
