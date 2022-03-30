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

            <input
                placeholder={`untitled note ${props.noteID}`}
                onChange={(e) => { updateTitle(e) }}
            ></input>
            <br />
            <button
                onClick={(e) => { removeNote(e) }}>
                remove note
            </button>
            <br />
            <br />


            {
                props.noteContent.items.map((item) => {
                    return (
                        <div>

                            <TextareaAutosize
                                key={item.itemID}
                                id={item.itemID}
                                className={item.done}
                                defaultValue={item.itemID}
                                onChange={(e) => updateContent(e)}
                            />

                            <input
                                type="checkbox"
                                id={item.itemID}
                                onClick={(e) => { toggleDone(e) }}
                            />

                            <button
                                id={item.itemID}
                                onClick={(e) => { removeItem(e) }}
                            >remove</button>

                        </div>
                    )
                })
            }

            <button
                onClick={(e) => { addItem(e) }}>
                + add new task
            </button>

        </div>
    )
}

export default Note;

