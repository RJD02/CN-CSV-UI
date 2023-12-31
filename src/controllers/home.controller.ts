import { Request, Response } from "express";
import { numFilesInsideData, printFileCache } from "../utils/csvCaching";

// getHome renders the homepage with all files
export const getHome = async (req: Request, res: Response) => {
  printFileCache();
  const files = await numFilesInsideData();
  files.sort((a, b) => b.queried - a.queried);
  return res.render("home", { files, title: "Homepage" });
};
