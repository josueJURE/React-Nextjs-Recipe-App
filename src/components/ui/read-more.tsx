import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import {Button} from "@/components/ui/button"

interface ReadMoreProps {
  id: string;
  text: string;
  amountOfWords?: number;
}

export function ReadMore({ id, text, amountOfWords = 36 }: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const splittedText = text.split(" ");
  const itCanOverFlow = splittedText.length > amountOfWords;
  const beginText = itCanOverFlow
    ? splittedText.slice(0, amountOfWords - 1).join(" ")
    : text;
  const endText = splittedText.slice(amountOfWords - 1).join(" ");

  const handleKeyboard = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.code === "Space" || e.code === "Enter") {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card id={id}>
      {beginText}
      {itCanOverFlow && (
        <>
          {!isExpanded && <span>... </span>}
          <span 
            className={`${!isExpanded && 'hidden'}`} 
            aria-hidden={!isExpanded}
          >
            {endText}
          </span>
          <Button
            className='text-violet-400 ml-2'
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-controls={id}
            onKeyDown={handleKeyboard}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'show less' : 'show more'}
          </Button>
        </>
      )}
    </Card>
  )
}
