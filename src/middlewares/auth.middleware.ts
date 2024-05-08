import { NextFunction, Request, Response } from "express";
import { LoginCredentials, RegisterPayload } from "../models/user.model";

class AuthMiddleware {

    public validateEmail = (email: string) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    public handleLogin = async (req: Request, res: Response, next: NextFunction) => {
        
        const user: LoginCredentials = req.body;
        const { email, password } = user;

        if (!email || !password) {
            res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
            return;
        }
    
        if (email.length === 0 || password.length === 0) {
            res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
            return;
        }

        if (!this.validateEmail(email)) {
            res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
            return;
        }

        next();
    }

    public handleRegister = async (req: Request, res: Response, next: NextFunction) => {

        const user: RegisterPayload = req.body;

        if (!user.username || !user.email || !user.password || !user.confirmPassword) {
            res.status(400).json({ message: 'Veuillez renseigner tout les champs.' });
            return;
        }
    
        if (user.username.length === 0 || user.email.length === 0 || user.password.length === 0 || user.confirmPassword.length === 0) {
            res.status(400).json({ message: 'Veuillez renseigner tout les champs.' });
            return;
        }
    
        if (user.password !== user.confirmPassword) {
            res.status(400).json({ message: 'Les 2 mots de passes doivent être identiques.' });
            return;
        }

        if (!this.validateEmail(user.email)) {
            res.status(400).json({ message: 'Veuillez renseigner une adresse email valide !' });
            return;
        }

        next();
    }

    public hasToken = async (req: Request, res: Response, next: NextFunction) => {
        
        const data = req.body;
        if (!data.token) {
            res.status(400).json({ message: 'Token invalide'});
            return;
        }

        next();

    }

}

export default new AuthMiddleware();