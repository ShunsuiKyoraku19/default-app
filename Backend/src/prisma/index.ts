import "dotenv/config";

import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
})

export default prisma; // aqui serve para a gente manipular os dados do banco de dados através do prisma ou seja teteus a gente vai usar o prisma para fazer as operações de crud no banco de dados seu mito