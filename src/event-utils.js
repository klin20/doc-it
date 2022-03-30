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
  const request = indexedDB.open("CarsDatabase", 1);

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  // Create the schema on create and version upgrade
  request.onupgradeneeded = function () {
    const db = request.result;
    const store = db.createObjectStore("cars", { keyPath: "id" });

  };

  request.onsuccess = function () {
    const db = request.result;
    const transaction = db.transaction("cars", "readwrite");

    const store = transaction.objectStore("cars");

    // Add some data
    if (typeOfEvent === 'save') {
      store.put(e);
    } else if (typeOfEvent === 'delete') {
      store.delete(e)
    }

    transaction.oncomplete = function () {
      db.close();
    };
  };

}