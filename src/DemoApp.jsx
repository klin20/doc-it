import React from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Popup from './Popup'

import { useState, useEffect } from 'react'
import ToDo from './todo/ToDo'

function DemoApp() {


  // get events from IndexedDB and pass it onto component
  const [events, setEvents] = useState([])

  useEffect(() => {
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
        setEvents(subaru.result);
      };
    }
  }, []);


  const [popupVisible, setPopupVisible] = useState(false)
  const [clickedEvent, setClickedEvent] = useState(null)

  const [calendarVisible, setCalendarVisible] = useState(true)
  const [todoVisible, setTodoVisible] = useState(true)

  // TIME FORMAT FROM SELECTING EVENT
  // 2022-03-22T07:30:00-04:00

  // TIME INPUT FORMAT IN FORM
  // 2022-03-11T17:50

  return (
    <>
      {popupVisible ?
        <Popup
          closePopup={() => { setPopupVisible(false) }}
          events={events}
          setEvents={setEvents}
          clickedEvent={clickedEvent}
          setClickedEvent={setClickedEvent}
        />
        :
        null
      }

      <div className='control'>
        <button
          onClick={() => { setCalendarVisible(!calendarVisible) }}
        >Toggle Calendar</button>
        <button
          onClick={() => { setTodoVisible(!todoVisible) }}
        >Toggle To-Do List</button>
      </div>

      <div className='demo-app'>



        <div className='demo-app-main'>
          {
            calendarVisible ?

              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: 'prev,next today myCustomButton',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                initialView='timeGridWeek'
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={events}

                //===============================================
                customButtons={{
                  myCustomButton: {
                    text: 'new event',
                    click: (arg) => {

                      setPopupVisible(true)
                    },
                  },
                }}
                //===============================================
                eventClick={(arg) => {


                  let eventObj = arg.event

                  let eventInfo = {
                    id: eventObj._def.publicId,
                    title: eventObj._def.title,
                    start: eventObj._instance.range.start,
                    end: eventObj._instance.range.end,
                    allDay: eventObj._def.allDay,
                    extendedProps: eventObj._def.extendedProps
                  }
                  setClickedEvent(eventInfo)
                  setPopupVisible(true)
                }}
              //===============================================

              /> :
              null
          }
        </div>

        {
          todoVisible ?
            <ToDo></ToDo> :
            null

        }

      </div>
    </>
  )
}

export default DemoApp;