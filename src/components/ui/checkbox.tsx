import { IoCheckmarkCircleSharp } from "react-icons/io5";

type CheckBoxProps = {
  text: string;
};

export function CheckBox({ text }: CheckBoxProps) {
  return (
    <div className="flex items-start gap-2 text-sm leading-6 text-[#3f4c43] sm:text-base">
      <IoCheckmarkCircleSharp className="mt-0.5 size-5 shrink-0 text-[#6f9b78]" />
      <p>{text}</p>
    </div>
  );
}






