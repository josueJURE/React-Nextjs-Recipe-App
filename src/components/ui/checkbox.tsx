import { IoCheckmarkCircleSharp } from "react-icons/io5";

import {

  heroSubtitleClassName
} from "@/utils/const";


type CheckBoxProps = {
  text: string;
  
};

export function CheckBox({ text }: CheckBoxProps) {
  return (
    <div className="flex columns-2 gap-1">
      <IoCheckmarkCircleSharp className="size-5.5 gap-2.5" />
      <p>{text}</p>
    </div>
  );
}


heroSubtitleClassName
