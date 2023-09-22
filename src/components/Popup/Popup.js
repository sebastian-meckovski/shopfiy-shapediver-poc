import React from "react";
import "./Popup.scss";

export default function Popup({
  renderContent,
  display = true,
  handleOkButtonClick,
  popupButtonText,
}) {
  return (
    display && (
      <div id="popup">
        <div id="popup__content">
          {typeof renderContent === "function" && renderContent()}
        </div>
        {typeof handleOkButtonClick === "function" && (
          <button id="popup__button" onClick={handleOkButtonClick}>
            {popupButtonText}
          </button>
        )}
      </div>
    )
  );
}
