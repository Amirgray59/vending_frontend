import { FaPlus } from "react-icons/fa6";
import Spinner from "./Spinner";

interface AddNewButtonProps {
  title: string;
  isLoading: boolean;
  onClick?:()=>void;
}

export default function AddNewButton({ title, isLoading ,onClick}: AddNewButtonProps) {
  return (
    <button onClick={onClick} disabled={isLoading} className="flex items-center justify-center gap-x-2 rounded-lg bg-blue-600 text-white text-sm font-medium py-2 px-5">
      <span>{title}</span>
      <span>{isLoading ? <Spinner /> : <FaPlus />}</span>
    </button>
  );
}
