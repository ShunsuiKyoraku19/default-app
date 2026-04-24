# FLUXCARR

Aplicativo mobile de **marketplace automotivo** (oficinas, agendamentos e notícias), desenvolvido para disciplina com **React Native (Expo)**, **TypeScript**, **SQLite local** e **AsyncStorage** para sessão.

## Tecnologias

- **Frontend:** Expo, React Native, TypeScript, expo-sqlite, AsyncStorage, React Navigation, expo-image-picker
- **Backend:** Node.js, Express, Multer (upload PNG/JPG)

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

## Expo Go

O frontend está em **Expo SDK 54** (compatível com o **Expo Go** atual do marketing place).

1. Instale **Expo Go** na loja de aplicativos.
2. Com `npx expo start`, use o mesmo Wi‑Fi do computador.
3. Android: abra o Expo Go e leia o QR code. iOS: Câmera nativa ou Expo Go.

## Backend opcional 

```bash
cd backend
npm install
npm start
```
