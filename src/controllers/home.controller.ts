import { Request, Response } from "express";
import { numFilesInsideData } from "../utils/saveFile";

export const getHome = async (req: Request, res: Response) => {
  const files = await numFilesInsideData();
  files.sort((a, b) => b.queried - a.queried);
  return res.render("home", { files, title: "Homepage" });
};
