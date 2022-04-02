import React from 'react'
import { useState, useEffect } from 'react'
import TextareaAutosize from "react-textarea-autosize";

import { createEventId, updateDb } from '../event-utils'

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


    // TWO LEVEL DEEP
    const updateContent = (e) => {

        let updatedNotes = props.allNotes.map((note) => {

            if (note.noteID === props.noteID) {

                note.items.map((item) => {

                    if (item.itemID === e.target.id) {
                        item.content = e.target.value
                    }
                })
            }
            return note
        })

        props.setAllNotes(updatedNotes)
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
                    placeholder={`untitled note`}
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
                                    checked={
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
                                    placeholder='task'
                                    onChange={(e) => updateContent(e)}
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

