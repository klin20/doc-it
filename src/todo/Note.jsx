import React from 'react'
import { useState, useEffect } from 'react'
import TextareaAutosize from "react-textarea-autosize";

import { createEventId } from '../event-utils'
import { updateDb } from './saveNotes'

function Note(props) {

    let itemObject = {
        itemID: createEventId(),
        content: undefined,
        done: 'notDone',
        color: undefined,
        order: undefined
    }

    // ONE LEVEL DEEP
    const addItem = () => {

        // go thru allNotes, search for note with matching nodeID, update that note.items, then update allNotes
        let updatedNotes = props.allNotes.map((note) => {

            if (note.noteID === props.noteID) {
                note.items.push(itemObject)
            }
            return note
        })

        props.setAllNotes(updatedNotes)
    }

    const removeNote = () => {
        let updatedNotes = props.allNotes.filter((note) => {

            return note.noteID !== props.noteID
        })
        props.setAllNotes(updatedNotes)
    }

    const updateTitle = (e) => {
        let updatedNotes = props.allNotes.map((note) => {

            if (note.noteID === props.noteID) {
                note.title = e.target.value
            }
            return note
        })
        props.setAllNotes(updatedNotes)
    }


    // NEED DEBOUNCE/EVENT THROTTLING FOR updateContent
    // DONT WANT TO SAVE TO DB FOR EVERY CHARACTER THE USER INPUTS
    // SAVE 1 SECOND AFTER THE LAST CHANGE

    // https://stackoverflow.com/a/61629055/6030118
    const [entry, setEntry] = useState(undefined);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // console.log(entry);
            // Send Axios request here
            // setDelayedEntry(entry);
            updateContent(entry)
            
        }, 2000);

        return () => clearTimeout(delayDebounceFn);
    }, [entry]);


    // TWO LEVEL DEEP
    const updateContent = (e) => {

        let updatedNotes = props.allNotes.map((note) => {

            if (note.noteID === props.noteID) {

                note.items.map((item) => {

                    // Ignore uncaught TypeError: Cannot read properties of undefined (reading 'target')
                    if (item.itemID === e.target.id) {
                        item.content = e.target.value
                    }
                })
            }
            return note
        })

        console.log('trying to save updated allNotes')
        props.setAllNotes(updatedNotes)
        console.log(updatedNotes)

    }

    const toggleDone = (e) => {
        let updatedNotes = props.allNotes.map((note) => {

            if (note.noteID === props.noteID) {
                note.items.map((item) => {
                    if (item.itemID === e.target.id) {

                        item.done === 'done' ?
                            item.done = 'notDone' :
                            item.done = 'done'
                    }
                })
            }
            return note
        })
        props.setAllNotes(updatedNotes)
    }

    const removeItem = (e) => {
        // let minusRemovedItem

        let x = props.allNotes.map((note) => {

            // grab the right note based on note ID
            if (note.noteID === props.noteID) {
                let minusRemovedItem = note.items.filter((item) => {

                    return (item.itemID !== e.target.id)
                })

                note.items = minusRemovedItem
            }
            return note
        })
        console.log(x)
        props.setAllNotes(x)
    }



    return (
        <div className="note">

            <div className='titleAndRemoveButton'>

                <input
                    defaultValue={props.noteContent.title}
                    onChange={(e) => { updateTitle(e) }}
                ></input>
                <button
                    onClick={(e) => { removeNote(e) }}>
                    remove note
                </button>
            </div>

            <ul>
                {
                    props.noteContent.items.map((item) => {

                        return (
                            <li >
                                <input
                                    type="checkbox"
                                    id={item.itemID}

                                    // remove problem shown to Kelly
                                    // checked, but remove pass the greenbox to another field, even if that field is not done
                                    defaultChecked={
                                        item.done === 'done' ?
                                            true :
                                            false
                                    }
                                    onClick={(e) => { toggleDone(e) }}
                                />

                                <TextareaAutosize
                                    key={item.itemID}
                                    id={item.itemID}
                                    className={item.done}
                                    defaultValue={item.content}
                                    placeholder={'enter your task here'}
                                    // onChange={(e) => updateContent(e)}
                                    onChange={(e) => {

                                        // setEntry(e.target.value)
                                        setEntry(e)
                                    }}

                                />

                                <button
                                    id={item.itemID}
                                    onClick={(e) => { removeItem(e) }}
                                >remove</button>

                            </li>
                        )
                    })
                }
            </ul>

            <button
                onClick={(e) => { addItem(e) }}>
                + add new task
            </button>

        </div>
    )
}

export default Note;

