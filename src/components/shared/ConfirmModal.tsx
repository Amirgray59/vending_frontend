import { Dispatch, SetStateAction } from "react";
import Modal from "./Modal";

interface ConfirmModalProps {
  onClose: () => void;
  open: boolean;
  title: string;
  handleConfirm: () => void;
  closeOnConfirm?: boolean;
  isConfirming?: boolean;
}

export default function ConfirmModal({
  onClose,
  open,
  title,
  handleConfirm,
  closeOnConfirm = true,
  isConfirming = false,
}: ConfirmModalProps) {
  const handleClick = () => {
    if (closeOnConfirm) onClose();
    handleConfirm();
  }
  return (
    <Modal onClose={onClose} open={open} title={title}>
      <div className=" mt-12 mb-8">
        <span className=" text-sm sm:text-[16] text-gray-500">
          آیا از تصمیم خود اطمینان دارید ؟
        </span>
      </div>
      <div className="w-full flex items-center justify-center gap-4">
        <button
          onClick={handleClick}
          disabled={isConfirming}
          className="py-2 w-full rounded-lg bg-blue-600 text-white font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          تایید
        </button>
        <button
          onClick={onClose}
          disabled={isConfirming}
          className=" py-2 w-full rounded-lg bg-gray-100 text-gary-800 font-semibold"
        >
          انصراف
        </button>
      </div>
    </Modal>
  );
}
