import cors from 'cors';
import "dotenv/config";
import express from "express";
import { router } from "./routes";

//import express, { NextFunction, Request, Response } from 'express'
//import {} from './routes'

const app = express()
app.use(express.json())
app.use(cors());
app.use(router);

const PORT = process.env.PORT! || 3000;


app.listen(PORT, () => {
    console.log("Servidor rodando AAAEEEE " + PORT)
});