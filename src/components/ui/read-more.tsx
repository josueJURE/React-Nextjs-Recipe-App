import { useState } from "react";

interface ReadMoreProps {
  id: string;
  text: string;
  amountOfWords?: number;
}

export function ReadMore({ id, text, amountOfWords = 36 }: ReadMoreProps) {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <>
        {text}
        
        </>
    )

}
