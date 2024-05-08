import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import userController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { LoginCredentials, RegisterPayload } from '../models/user.model';


if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const router = Router();

router.post('/login', authMiddleware.handleLogin, async (req, res) => {
    const user: LoginCredentials = req.body;
    const matchingUser = await userController.findUser(user.email);
    
    if (!matchingUser) {
        res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        return;
    }

    const validCredentials = await bcrypt.compare(user.password, matchingUser.password);

    if (!validCredentials) {
        res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        return;
    }

    const payload = { ...matchingUser, password: undefined };
    const authToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });

    res.status(200).json({ message: 'Authenticated', user: {...matchingUser, password: undefined, token: authToken }});
})

router.post('/register', authMiddleware.handleRegister, async (req, res) => {
    const user: RegisterPayload = req.body;
    try {
        await userController.createUser(user);
        res.status(200).json({ message: 'Success', user: { email: user.email, username: user.username } })
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                switch (e.meta?.target) {
                    case 'Users_email_key':
                        res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
                        break;
                    case 'Users_name_key':
                        res.status(400).json({ message: 'Un utilisateur avec ce pseudo existe déjà.' });
                        break;
                    default:
                        res.status(400).json({ message: "Impossible d'enregistrer cet utilisateur." });
                        break;
                }
            } else {
                res.status(400).json({ message: "Impossible d'enregistrer cet utilisateur." });
            }
        } else {
            console.error(e);
            res.status(500).json({ message: 'Something went wrong.' });
        }
    }
});

router.post('/validtoken', authMiddleware.hasToken, async (req, res) => {
    const { token } = req.body;
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        res.status(200).json({ message: 'Success', user: payload });
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong.' });
        console.error(e);
    }
});

export default router;