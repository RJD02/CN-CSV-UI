/*
* cacheItem = {
    data: any --> it will contain the csv parsed array
    queried: Number --> number of times it is queried
  }
* cache = map<string, cacheItem> --> fileId : cacheItem(PRIVATE)
* maxSize: Number --> max number of items in the queue(PRIVATE)
* set(fileId: string, data) --> check if map has exceeded maxSize. Yes -> delete() -> add to the map, and set the default values <- No
* get(fileId: string) --> check if item of key fileId exists on the map. Yes -> Update the queried field and return the data. No -> return null | undefined
* delete() --> delete the least queried cacheItem
* delete(fileId: string) --> to update, we have to delete the existing entry and insert updated item
* clear() --> clear the cache
 */

/*
 * Seaching
 * Map -> O(1)
 * Array -> O(n)
 *
 * Updating
 * Map -> O(n)
 * Array -> O(n)
 *
 * Inserting
 * Map -> O(1)
 * Array -> O(1)
 *
 * Deleting
 * Map -> O(1)
 * Array -> O(n) // in worst-case
 */

export interface CacheItem {
  data: [];
  nQueried: number;
}

class Cache {
  private readonly maxSize: number;
  private cache: Map<string, CacheItem>;
  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.cache = new Map<string, CacheItem>();
  }

  set(fileId: string, data: []): void {
    if (this.cache.size >= this.maxSize) {
      this.delete();
    }
    this.cache.set(fileId, { nQueried: 1, data });
  }

  getQueried(fileId: string): number {
      const item = this.cache.get(fileId);
      if(item) return item.nQueried;
      return 0;
  }

  get(fileId: string): {}[] | null {
    const item = this.cache.get(fileId);
    if (item) {
      const updatedItem: CacheItem= {
        data: item.data,
        nQueried: item.nQueried + 1,
      };
      this.cache.delete(fileId);
      this.cache.set(fileId, updatedItem);
      return updatedItem.data;
    }
    return null;
  }

  delete(fileId = "") {
    if (fileId === "") {
      let minQueries = Number.MAX_SAFE_INTEGER;
      let fileName = "";
      this.cache.forEach((val, key) => {
        if (val.nQueried < minQueries) {
          fileName = key;
          minQueries = val.nQueried;
        }
      });
      this.cache.delete(fileName);
    } else {
      this.cache.delete(fileId);
    }
  }
}

export default Cache;
