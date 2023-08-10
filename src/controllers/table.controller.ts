import { Request, Response } from "express";
import { getFileData, updateNQueriedOnRequest } from "../utils/csvCaching";

export const getTableController = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perpage) || 100;
   updateNQueriedOnRequest(fileId);

    const fileData = await getFileData(page, perPage, fileId);
    if(fileData.length <= 0) return res.redirect('/');
    const headers = Object.keys(fileData[0]);
    return res.render("table", { data: fileData, title: "File Detail", headers });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


