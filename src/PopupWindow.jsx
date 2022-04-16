import React from "react";
 
const PopupWindow = props => {
    const {popupcontent, setIsOpen} =  props

    const closePopup = () => {
        setIsOpen(false)
    }

    return (
    <div className="popupwindow-container">
      <div className="popupwindow-box">
        <p>Event {popupcontent}! 🎉</p>
        <button className="popupwindow-closeButton" onClick={closePopup}>OK!</button>
      </div>
    </div>
  );
};
 
export default PopupWindow;