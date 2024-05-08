import express, { NextFunction, Request, Response } from "express";

class DefaultMiddleware {

    public handleRequest = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.headers['content-type']) {
            res.status(400).json({ message: 'Something went wrong.' })
        }
        if (req.headers['content-type']?.indexOf('application/json') === -1) {
            res.status(400).json({ message: 'Something went wrong.' })
        }
        try {
            express.json()(req, res, next);
        } catch (e) {
            next(e);
        }
    }

    public handleError = async (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong.' })
    }

}

export default new DefaultMiddleware();