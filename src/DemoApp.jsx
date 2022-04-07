import React from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Popup from './Popup'
import PopupWindow from './PopupWindow'

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
    const request = indexedDB.open("EventsDatabase", 1);

    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };

    // Create the schema on create and version upgrade
    // IF FIRST TIME, USER WONT HAVE RIGHT DB, THIS SETS IT UP
    request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore("events", { keyPath: "id" });
    };

    request.onsuccess = (event) => {

      const db = request.result;
      const transaction = db.transaction("events", "readonly");
      const store = transaction.objectStore("events");
      const subaru = store.getAll();

      subaru.onsuccess = () => {
        // console.log(subaru.result)
        setEvents(subaru.result);

        console.log(subaru.result)
      };
    }
  }, []);


  const [popupVisible, setPopupVisible] = useState(false)
  const [clickedEvent, setClickedEvent] = useState(null)

  // CHANGE BACK WHEN DONE WITH TODO DB
  const [calendarVisible, setCalendarVisible] = useState(false)
  const [todoVisible, setTodoVisible] = useState(true)

  // TIME FORMAT FROM SELECTING EVENT
  // 2022-03-22T07:30:00-04:00

  // TIME INPUT FORMAT IN FORM
  // 2022-03-11T17:50

  const [popupcontent, setPopupcontent] = useState(''); 
  const [isOpen, setIsOpen] = useState(false);
  // For Popupwindow component

  return (
    <>
      {popupVisible ?
        <Popup
          closePopup={() => { setPopupVisible(false) }}
          events={events}
          setEvents={setEvents}
          clickedEvent={clickedEvent}
          setClickedEvent={setClickedEvent}
         
          setPopupcontent={setPopupcontent}
          setIsOpen={setIsOpen}
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



        {
          calendarVisible ?

            <div className='demo-app-main'>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: 'title myCustomButton',
                  // center: 'today',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay prev,next'
                }}
                initialView='timeGridWeek'
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={events}
                nowIndicator={true}


                // now={new Date().getUTCHours()}

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

              />
            </div>
            :
            null
        }

        {
          todoVisible ?
            <ToDo></ToDo> :
            null

        }

        { isOpen ?
          <PopupWindow 
          popupcontent={popupcontent}
          setIsOpen={setIsOpen}
          /> : null
        }
      </div>
    </>
  )
}

export default DemoApp;