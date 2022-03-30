import { useState, useEffect } from "react"

export function useWindowSize(){

    const [isSmallScreen, setIsSmallScreen] = useState(false)
    
    const checkScreen = () => {
        setIsSmallScreen(window.innerWidth < 768)
    }

    useEffect(() => {
        checkScreen();
        window.addEventListener('resize', checkScreen)

        return () => {
            window.removeEventListener('resize', checkScreen)
        }
    }, [])

    return isSmallScreen;
}

export function useGetData(){

    let x;

    const indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB ||
      window.shimIndexedDB;

    // Open (or create) the database
    const request = indexedDB.open("CarsDatabase", 1);

    request.onsuccess = (event) => {

      const db = request.result;
      const transaction = db.transaction("cars", "readonly");
      const store = transaction.objectStore("cars");

      const subaru = store.getAll();

      subaru.onsuccess = () => {
        console.log(subaru.result)
        // setEvents(subaru.result)
        x = subaru.result;
      };
    }
    console.log(x)
    return x
}