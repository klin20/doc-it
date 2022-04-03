export function createEventId() {
  // https://gist.github.com/gordonbrander/2230317
  return ('_' + Math.random().toString(36).substr(2, 9));
}


// typeOfEvent === 'save', 'delete'
export const updateDb = (e, typeOfEvent) => {

  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  // Open (or create) the database
  const request = indexedDB.open("EventsDatabase", 1);

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onsuccess = function () {
    const db = request.result;
    const transaction = db.transaction("events", "readwrite");

    const store = transaction.objectStore("events");

    // Add some data
    if (typeOfEvent === 'save') {
      console.log(e)
      store.put(e);
    } else if (typeOfEvent === 'delete') {
      store.delete(e)
    }

    transaction.oncomplete = function () {
      db.close();
    };
  };

}