import React from 'react'
import { useState, useEffect } from 'react'

import { createEventId } from '../event-utils'
import { updateDb } from './saveNotes'
import Note from './Note'

function ToDo() {


    const [allNotes, setAllNotes] = useState([])

    // GET ALL NOTES FROM INDEXEDDB
    useEffect(() => {
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
        // IF FIRST TIME, USER WONT HAVE RIGHT DB, THIS SETS IT UP
        request.onupgradeneeded = function () {
            const db = request.result;
            const store = db.createObjectStore("notes", { keyPath: "noteID" });
        };

        request.onsuccess = (event) => {

            const db = request.result;
            const transaction = db.transaction("notes", "readonly");
            const store = transaction.objectStore("notes");
            const subaru = store.getAll();

            subaru.onsuccess = () => {
                console.log(subaru.result)
                setAllNotes(subaru.result);
            };
        }
    }, []);


    const noteObject = {
        noteID: createEventId(),
        title: undefined,
        color: '#FFADAE',
        order: Date.now(),
        items: []
    }

    const addNote = () => {
        // do this so newer note gets insert on top/appear first
        let temp = noteObject
        setAllNotes([temp, ...allNotes])

        // add this new note to indexedDB
        updateDb(temp, 'save')
    }

    return (
        <div className="todo">
            <h2 class="td-header">To-do Lists</h2>
            <button class="add-list"
                onClick={() => { addNote() }} >
                + Add List</button>

            {

                allNotes.map((note) => {

                    // note follows the same template as noteObject 

                    return (
                        <Note
                            key={note.noteID}
                            noteID={note.noteID}

                            noteContent={note}
                            // noteContent has
                            // id, title, color, items

                            allNotes={allNotes}
                            setAllNotes={setAllNotes}
                        ></Note>
                    )
                })
            }
        </div>
    )
}

export default ToDo;

