import React from 'react'
import {useState, useEffect} from 'react'

import { createEventId, updateDb } from '../event-utils'
import Note from './Note'

import {sampleEvents} from './config'
function ToDo() {

    
    const [allNotes, setAllNotes] = useState([])

    // NO LOCAL SAVING/INDEXEDDB FUNCTION YET
    // IF NEED SOME DATA TO WORK ON, UNCOMMENT LINE IN useEffect below
    useEffect(() => {
        setAllNotes(sampleEvents)
    } , [])

    
    const noteObject = {
        noteID: createEventId(),
        title: undefined,
        color: undefined,
        items : []
    }

    const addNote = () => {
        // do this so newer note gets insert on top/appear first
        setAllNotes([noteObject,...allNotes])
    }

    return (
        <div className="todo">
            <h2>TODO</h2>
            <button 
            onClick={() => {addNote()}} >
                + Add New Note</button>

            {
                
                allNotes.map((note) => {

                    // note follows the same template as noteObject 

                    return(                  
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

