import express, { Request, Response } from "express";

const fileRouter = express.Router();

fileRouter.post("/upload", (req: Request, res: Response) => {});

export default fileRouter;
