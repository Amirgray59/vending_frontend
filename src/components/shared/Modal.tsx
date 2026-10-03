"use client";

import useOutsideClick from "@/hooks/useOutsideClick";
import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import { HiMiniXMark } from "react-icons/hi2";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  open: boolean;
  title?: string;
  description?: string;
}

function Modal({ onClose, children, open, title, description }: ModalProps) {
  const ref = useOutsideClick<HTMLDivElement>(onClose);

  if (!open) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-slate-900/40 backdrop-blur-xs transition-all duration-300">
      <div
        ref={ref}
        className={`shadow-lg min-w-xs max-h-[500] sm:max-h-[580] p-6  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white dark:bg-slate-600 transition-all duration-300 overflow-y-auto sm:w-full max-w-screen-sm`}
      >
        <div className=" flex items-center justify-between border-b border-gray-200 pb-4 ">
          <span className=" tetxlg font-semibold text-gray-600">{title}</span>
          <button onClick={onClose} className="">
            <HiMiniXMark className="text-xl text-gray-500" />
          </button>
        </div>
        
        <div className={``}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
