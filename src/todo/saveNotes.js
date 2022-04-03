
// typeOfEvent === 'save', 'delete'
export const updateDb = (e, typeOfEvent) => {

    const indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB ||
      window.shimIndexedDB;
  
    // Open (or create) the database
    const request = indexedDB.open("NotesDatabase", 1);
  
    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };
  
    // Create the schema on create and version upgrade
    request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore("notes", { keyPath: "noteID" });
  
    };
  
    request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction("notes", "readwrite");
  
      const store = transaction.objectStore("notes");
  
      // Add some data
      if (typeOfEvent === 'save') {
        // console.log(e)
        store.put(e);
      } else if (typeOfEvent === 'delete') {
        
        // WHEN DELETING SEND IN THE ID (NOT OBJECT)
        store.delete(e)
      }
  
      transaction.oncomplete = function () {
        db.close();
      };
    };
  
  }