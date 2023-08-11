import fs from "fs";

import { numFilesInsideData, removeFileFromCache } from "./csvCaching";

// deleteCSVFile returns a new promise. It deletes the file with id fileId inside store..
// File is unlinked asyncly
export const deleteCSVFile = (fileId: string) =>
  new Promise<{ success: Boolean; error: null | String }>(
    async (resolve, reject) => {
      const fileNamesInData = await numFilesInsideData();
      const fileNameToDelete = fileNamesInData.filter(
        (file) => file.fileId === fileId
      )[0];
      removeFileFromCache(fileNameToDelete.fileName);
      fs.unlink("data/" + fileNameToDelete.fileName, (err) => {
        if (err) reject({ success: false, error: err });
        resolve({ success: true, error: null });
      });
    }
  );
