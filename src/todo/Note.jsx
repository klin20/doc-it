import React from 'react'
import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TextareaAutosize from "react-textarea-autosize";
import Confetti from 'react-confetti';

import { createEventId } from '../event-utils'
import { updateDb } from './saveNotes'

function Note(props) {

    // NEED DEBOUNCE/EVENT THROTTLING FOR updateContent
    // DONT WANT TO SAVE TO DB FOR EVERY CHARACTER THE USER INPUTS
    // SAVE 1 SECOND AFTER THE LAST CHANGE

    // https://stackoverflow.com/a/61629055/6030118
    const [entry, setEntry] = useState(undefined);

    // NEED delayedEntry o/w when removing notes, removed notes dissappear then reappear on current page (gone when refersh)
    const [delayedEntry, setDelayedEntry] = useState(undefined);
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Send Axios request here
            setDelayedEntry(entry);


            entry.target.name === 'title' ?
                updateTitle(entry) :
                updateContent(entry)

        }, 600);

        return () => clearTimeout(delayDebounceFn);
    }, [entry]);


    const removeNote = () => {
        let updatedNotes = props.allNotes.filter((note) => {

            return note.noteID !== props.noteID
        })
        console.log(updatedNotes)
        props.setAllNotes(updatedNotes)
        updateDb(props.noteID, 'delete')
    }


    const [title, setTitle] = useState(props.noteContent.title)
    const [items, setItems] = useState(props.noteContent.items)

    // ONE LEVEL DEEP
    const addItem = () => {

        let newItem = {
            itemID: createEventId(),
            content: undefined,
            done: 'notDone',
            color: undefined,
            order: undefined
        }

        setItems([...items, newItem])

        updateDb({
            noteID: props.noteContent.noteID,
            title: title,
            color: undefined,
            items: [...items, newItem]
        }, 'save')

    }


    const updateTitle = (e) => {
        setTitle(e.target.value)

        updateDb({
            noteID: props.noteContent.noteID,
            title: e.target.value,
            color: undefined,
            items: items
        }, 'save')
    }

    const [rainConfetti, setRainConfetti] = useState(false);

    const toggleDone = (e) => {
        let itemsUpdatedCheckboxes = items.map((item) => {
            if (item.itemID === e.target.id) {

                item.done === 'done' ?
                    item.done = 'notDone' :
                    (item.done = 'done', showConfetti())
            }

            return item
        })


        setItems(itemsUpdatedCheckboxes)

        updateDb({
            noteID: props.noteContent.noteID,
            title: e.target.value,
            color: undefined,
            items: itemsUpdatedCheckboxes
        }, 'save')
    }

    const showConfetti = () => {
        setRainConfetti(true);
        setTimeout(() => { setRainConfetti(false) }, 4000);
    }

    const removeItem = (e) => {

        let itemsMinusRemovedItem = items.filter((item) => {
            return item.itemID !== e.target.id
        })

        console.log(itemsMinusRemovedItem)

        setItems(itemsMinusRemovedItem)

        updateDb({
            noteID: props.noteContent.noteID,
            title: e.target.value,
            color: undefined,
            items: itemsMinusRemovedItem
        }, 'save')
    }


    // // TWO LEVEL DEEP
    const updateContent = (e) => {

        console.log('updating content')
        // console.log(e)

        let itemsWithUpdatedContent = items.map((item) => {

            if (item.itemID === e.target.id) {
                item.content = e.target.value
            }

            return item
        })

        console.log(itemsWithUpdatedContent)

        setItems(itemsWithUpdatedContent)

        updateDb({
            noteID: props.noteContent.noteID,
            title: title,
            color: undefined,
            items: itemsWithUpdatedContent
        }, 'save')
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    const onDragEnd = result => {
        console.log(result);
        setItems(reorder(items, result.source.index, result.destination.index));

        let x = reorder(items, result.source.index, result.destination.index)

        updateDb({
            noteID: props.noteContent.noteID,
            title: title,
            color: undefined,
            items: x
        }, 'save')
    }

    // CSS related code for color button 
    const colorCode = ['#FFADAE', '#FFF0A0', '#93E396', '#85B6FF', '#D5B5FF']
    const colorClassName = ['colorOptionOne', 'colorOptionTwo', 'colorOptionThree', 'colorOptionFour', 'colorOptionFive']

    // default note color
    const [noteColor, setNoteColor] = useState(props.noteContent.color)

    const updateColor = (colorCode) => {
        // const targetTheme = document.getElementsByClassName(`note${props.noteID}`);
        // for (let i = 0; i < targetTheme.length; i++) {
        //     // targetTheme[i].style.border =`${color} 2px solid`;
        //     // targetTheme[i].style.borderTop =`40px ${color} solid`;
        //     targetTheme[i].style.borderColor =`${color}`;
        // }

        setNoteColor(colorCode)

        updateDb({
            noteID: props.noteContent.noteID,
            title: title,
            color: colorCode,
            items: items
        }, 'save')

        console.log(colorCode)
    }



    return (

        <div
            className={"note note" + props.noteID}
            style={{
                borderColor: noteColor
            }}>
            {rainConfetti ? <Confetti
                tweenDuration={1000} recycle={false} numberOfPieces={300} /> : null}
            <div className="titleAndRemoveButton">

                <input className="td-title"
                    defaultValue={title}
                    name={'title'}
                    placeholder={'Title (20 char. max)'}
                    // placeholder={noteObject.noteID}
                    maxLength={20}
                    onChange={(e) => { setEntry(e) }}
                ></input>

                <div className='colorSwitchContainer'>
                    <p>
                        •••
                    </p>
                    <div className='colorSwitchOptions'>
                        {
                            colorCode.map((color, index) => {

                                let colorHex = colorCode[index]

                                return (
                                    <button
                                        // className={`colorOptions ${colorClassName[index]}`}
                                        className={`colorOptions`}
                                        style={{backgroundColor: colorHex}}
                                        onClick={() => { updateColor(colorHex) }}
                                        // onClick sends the index
                                    ></button>
                                )
                            })
                        }
                    </div>
                </div>
                <button class="dlt-todo"
                    onClick={(e) => { removeNote(e) }}>
                    ✖
                </button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="taskList">
                    {(provided) => (
                        <ul ref={provided.innerRef} {...provided.droppableProps} >
                            {

                                items.map((item, index) => {

                                    return (
                                        <Draggable
                                            key={item.itemID}
                                            draggableId={item.itemID}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    <input
                                                        type="checkbox"
                                                        id={item.itemID}

                                                        // remove problem shown to Kelly
                                                        // checked, but remove pass the greenbox to another field, even if that field is not done

                                                        // current version with IndexedDB, defaultChecked recreates's Kelly problem, but checked doesnt???
                                                        checked={
                                                            item.done === 'done' ?
                                                                true :
                                                                false
                                                        }
                                                        onChange={(e) => { toggleDone(e) }}
                                                    />

                                                    <TextareaAutosize
                                                        key={item.itemID}
                                                        id={item.itemID}
                                                        className={item.done}
                                                        defaultValue={item.content}
                                                        disabled={
                                                            item.done === 'done' ?
                                                                true :
                                                                false
                                                        }
                                                        placeholder={'click to add task'}
                                                        // onChange={(e) => updateContent(e)}
                                                        onChange={(e) => {

                                                            // setEntry(e.target.value)
                                                            setEntry(e)
                                                        }}

                                                    />

                                                    <button class="dlt"
                                                        id={item.itemID}
                                                        onClick={(e) => { removeItem(e) }}
                                                    >🗑</button>

                                                </li>

                                            )}
                                        </Draggable>
                                    )
                                })
                            }
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

            <button class="add-task"
                onClick={(e) => { addItem(e) }}>
                + add new task
            </button>

        </div>
    )
}

export default Note;

