import { useState } from "react";

interface ReadMoreProps {
  id: string;
  text: string;
  amountOfWords?: number;
}

export function ReadMore({ id, text, amountOfWords = 36 }: ReadMoreProps) {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const splittedText = text.split(' ')
    const itCanOverFlow = splittedText.length > amountOfWords
    const beginText = itCanOverFlow  ? splittedText.slice(0, amountOfWords - 1).join(" ") : text

    return (
        <>
        {text}
        
        </>
    )

}
