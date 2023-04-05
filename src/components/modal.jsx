import React from "react";
import "../styles/modal.scss";

export default function Modal(props) {
  if (!props.show) {
    return null;
  }
  return (
    <div className="modal" onClick={props.onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body">{props.children}</div>
      </div>
    </div>
  );
}
