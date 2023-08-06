# A CSV Interface

## Caching Algorithm
The caching algorith is implemented so that, we don't have to fetch the files again and again(as it will incur more cost of opening and reading the files). We can assume that the csv file uploaded can contain rows of magnitude 10^5. So if user is requesting the file to be read
We can assume that the csv file uplaoded can contain rows of magnitude 10^5. If user is requesting the file frequently, then on each request we have to fetch the data from the file(in server). For now, I have not implemented authentication to maintain uniqueness for the files of each user separately, i.e. files of all the users are stored at the same place.

The question also contained extra points for building a pagination, which will require us to fetch a specified amount of data(e.g. 100 rows) at a time. Combine it with the frequent requests and large file buffer, and the server will have a large toll for memory as well as time.
The solution is to hold a specified number of files into heap(memory), which will help reduce the time to fetch the data, effectively caching. The pagination can also be implemented easily, since it will be an array, and user can provide with the page he/she wants to view. Now, the simplest caching algorithm can be LRU. But it comes with associated cost.

The user may have to view a specific file frequently, but LRU will potentially remove that file if new files are also being loaded. This can again prove to be costly(in terms of memory and time). We need a caching system which can prioritize the number of times that file is queried. This is because, since a file is being queried multiple times, it will potentially be queried again in the future. So, we need a priority queue, which will maintain the queue based on priority of queries.
For this I have built a Map based priority caching(Array based has one downfall). Advantages of map over array are:

Here n being the length of files stored in cache.

* Searching for least queried entry
Map takes O(n). Array takes O(n). In map it could be O(1), with min heap.
* Get the cached file(using fileId or fileName)
Map takes O(1). Array takes(n)
* Deleting a entry
Map takes O(1). Array takes O(n), because of shifting if first element in the array is poped
* Inserting a entry
Map takes O(1). Array takes O(1)

We can also go for a min heap construction, which will help reduce the searching time of least queried entry by O(1). But it will require a complex construct. Our main concern was to, cache the most used files and not fetch them fresh everytime user requests. Our caching system could include(could increase with number of servers), for e.g. 100 files. Sifting through 100 entries will not cost much, espcially when on every iteration we have O(1) calculation. This is bearable.

The complete implementation can be found in (./util
