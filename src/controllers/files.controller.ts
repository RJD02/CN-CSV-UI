import { Request, Response } from "express";

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No CSV file uploaded" });
  }
  return res.status(200).json({ message: "file uploaded successfully" });
};
