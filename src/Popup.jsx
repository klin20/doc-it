import React from 'react'
import { useState, useEffect } from 'react'
import { createEventId, updateDb } from './event-utils'



function Popup(props) {
  const {setPopupcontent, setIsOpen} =  props
  // props:
  // closePopup={() => {setPopupVisible(false)}}
  // events={events}
  // setEvents={setEvents}
  // clickedEvent={clickedEvent}
  // setClickedEvent={setClickedEvent}

  const [allDay, setAllDay] = useState(undefined)

  // MAYBE NOT NEEDED
  // useEffect(() => {
  //   props.clickedEvent ?
  //     setAllDay(props.clickedEvent.allDay) :
  //     null
  // }, [])


// HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault()

    let form = e.target.form

    // non empty
    let title = (form.title.value)

    // check later if need the ":00-04:00" part
    let id = createEventId()
    // let startTime = (form.startTime.value + ":00-04:00")
    let startTime = (form.startTime.value)
    // console.log(startTime)
    let allDay = (form.allDay.checked)
    // let endTime = (form.endTime.value + ":00-04:00")
    let endTime = (form.endTime.value)
    // console.log(endTime)

    // check one if allDay or endTime is truthy

    // check that end date is AFTER start date
    // if allDay true, ignore endTime
    // if allDay check, grey out endTime

    // check that there IS a startTime

    // existing startTime smaller than non-existing endTime

    let links = (form.links.value)
    let description = (form.description.value)

    let newEvent = {
      id: id,
      title: title,
      start: startTime,
      end: endTime,
      allDay: allDay,
      extendedProps: {
        links: links,
        description: description,
        inputStart: startTime,
        inputEnd: endTime
      }
    }

    props.setEvents([...props.events, newEvent])

    // typeOfEvent === 'save', 'update', 'delete'
    updateDb(newEvent, 'save')

    props.closePopup()
  }


  // HANDLE DELETE
  const handleDelete = (e) => {
    e.preventDefault()

    let eventsMinusRemoved = props.events.filter((event) => {
      return event.id !== props.clickedEvent.id
    })
    props.setEvents(eventsMinusRemoved)

    updateDb(props.clickedEvent.id, 'delete')
    props.setClickedEvent(null)
    props.closePopup()
  }


  // HANDLE UPDATE
  // CREATE A NEW EVENT WITH DATA FROM OLD EVENT
  // DELETE OLD EVENT
  const handleUpdate = (e) => {
    e.preventDefault()

    let form = e.target.form

    let updatedEvent = {
      id: createEventId(),
      title: form.title.value,
      start: form.startTime.value,
      end: form.endTime.value,
      allDay: form.allDay.checked,
      extendedProps: {
        links: form.links.value,
        description: form.description.value,
        inputStart: form.startTime.value,
        inputEnd: form.endTime.value
      }
    }

    let eventsMinusUpdated = props.events.filter((eventObj) => {
      return (eventObj.id !== props.clickedEvent.id)

    })

    eventsMinusUpdated = [...eventsMinusUpdated, updatedEvent]
    props.setEvents(eventsMinusUpdated)

    updateDb(updatedEvent, 'save')
    updateDb(props.clickedEvent.id, 'delete')

    props.setClickedEvent(null)
    props.closePopup()
  }


  const oneHourAfter = (e) => {
    console.log(e.target.form.startTime)

    if (e.target.form.startTime.value) {
      let oneHourAfter = new Date(e.target.form.startTime.value)
      // console.log(oneHourAfter)
      // console.log(oneHourAfter.toISOString())
      oneHourAfter.setHours(oneHourAfter.getHours() + 1)
      // console.log(oneHourAfter)
      // console.log(oneHourAfter.toISOString().slice(0,16))
      return oneHourAfter.toISOString().slice(0, 16)
    }
  }

  const popupWindow = (content) => {
    setPopupcontent(content)
    setIsOpen(true)
  }

  return (
    <div className='popup'>

      <form action=""
      // onSubmit={(e) => handleSubmit(e)}
      >

        <div className="modalHeader">
          <h2 className="eventHeader">New Event</h2>
          <button className="cancel" onClick={() => {
            props.closePopup()
            props.setClickedEvent(null)
          }}>✖</button>
        </div>

        <label htmlFor="">Event Title</label>
        <input
          type="text"
          name='title'
          placeholder="Add title"
          required={true}
          defaultValue={props.clickedEvent ? props.clickedEvent.title : undefined}

        />

        <br/>

        <div>
          <div className="start">
            <label htmlFor="">Start Time and Date</label>
            <input
              type="datetime-local"
              name='startTime'
              required={true}
              defaultValue={props.clickedEvent ? props.clickedEvent.extendedProps.inputStart : undefined}
            />
          </div>

          <div className="end">
            <label htmlFor="">End Time and Date</label>
            <input
              type="datetime-local"
              name='endTime'

              // MAYBE NOT NEEDED
              // disabled={allDay}

              defaultValue={props.clickedEvent ? props.clickedEvent.extendedProps.inputEnd : undefined}

              // auto select one hour after start time
              // onFocus={(e) => {
              //   e.target.value = oneHourAfter(e)
              // }}
            />
          </div>

          <br/>

          <div>
            <input
              type="checkbox"
              name="allDay" id="allDay"
              // MAYBE NOT NEEDED
              // onClick={(e) => { setAllDay(!allDay) }}
              defaultChecked={props.clickedEvent ? props.clickedEvent.allDay : undefined}
            />
            <label for="allDay">All Day</label>
          </div>
        </div>

        <br/>

        <label htmlFor="">Links</label>
        <textarea
          name="links"
          id=""
          rows="3"
          defaultValue={props.clickedEvent ? props.clickedEvent.extendedProps.links : undefined}


        ></textarea>

        <br/>

        <label htmlFor="">Description</label>
        <textarea
          name="description"
          id=""
          rows="3"
          defaultValue={props.clickedEvent ? props.clickedEvent.extendedProps.description : undefined}

        ></textarea>


        <br />
        <br />
        {
          props.clickedEvent ?
            <>

              <div className="upd-dlt">
                <button class="dlt-evt"
                  onClick={ (e) => { handleDelete(e); popupWindow('deleted')}}>
                  Delete Event
                </button>

                <button className="upd"
                  onClick={(e) => { handleUpdate(e);popupWindow('updated') }}>
                  Update Event
                </button>
              </div>

            </>
            :
            <button className="new-event"
              type='submit'
              onClick={(e) => { handleSubmit(e);popupWindow('created')  }}>Create New Event
            </button>
        }
      </form>
    </div>
  );

}

export default Popup;

