import Cache, { CacheItem } from "./caching";
import csv from "csv-parser";
import fs from "fs";

const MAX_FILE_CACHE = 10;

const fileCache = new Cache(MAX_FILE_CACHE);

const loadFileIntoCache = (fileId: string) =>
  new Promise<void>((resolve, reject) => {
    const results: any = [];
    fs.createReadStream(fileId)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        fileCache.set(fileId, results);
        return results;
      })
      .on("finish", resolve)
      .on("error", reject);
  });

export const getFileData = async (
  page: number,
  perPage: number,
  fileId: string
): Promise<{}[]> => {
    console.log(fileCache);
  const fileData = fileCache.get(fileId);
  if (fileData) {
    const startRow = (page - 1) * perPage;
    const endRow = startRow + perPage;
    return fileData.slice(startRow, Math.min(endRow, fileData.length));
  }

  await loadFileIntoCache(fileId);
  return getFileData(page, perPage, fileId);
};
