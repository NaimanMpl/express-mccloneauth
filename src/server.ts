import dotenv from 'dotenv';
import express from 'express';
import defaultMiddleware from './middlewares/default.middleware';
import authRoute from './routes/auth.route';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();

app.use(defaultMiddleware.handleRequest);
app.use(defaultMiddleware.handleError);
app.use(express.json())

app.use('/auth', authRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
});

export default app;