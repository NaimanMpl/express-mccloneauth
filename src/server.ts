import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import express from 'express';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`)
})