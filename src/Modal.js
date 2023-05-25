import React from "react";
import ReactDom from "react-dom";
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Modal({ open, children, onClose }) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[1000]" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 z-[1000] rounded-lg">
        <button className="absolute top-4 right-6" onClick={onClose}>
          <XMarkIcon className="text-black h-6 w-6"/>
        </button>
        {children}
      </div>
    </>,
    document.getElementById("portal")
  );
}
