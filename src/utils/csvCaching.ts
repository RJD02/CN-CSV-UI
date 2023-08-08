import Cache, { CacheItem } from "./caching";
import csv from "csv-parser";
import fs from "fs";

const MAX_FILE_CACHE = 10;

const fileCache = new Cache(MAX_FILE_CACHE);

export const getFileId = (fileName: string) => {
  return fileName.split("-")[0];
};

const loadFileIntoCache = (fileName: string) =>
  new Promise<void>((resolve, reject) => {
    const results: any = [];
    fs.createReadStream(fileName)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        const fileId = getFileId(fileName);
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

export const getTimesQueriedFiles = (files: string[]) => {
  return files.map((file) => {
    return {
      file,
      queried: fileCache.getQueried(file),
    };
  });
};

export const printFileCache = () => {
  console.log(fileCache);
};

export const getTimesQueriedFile = (file: string) => {
  return fileCache.getQueried(file);
};

export const removeFileFromCache = (fileId: string) => {
  fileCache.delete(fileId);
};
