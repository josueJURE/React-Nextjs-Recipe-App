import { useState } from "react";

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

  const handleKeyboard = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Space" || e.code === "Enter") {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <p id={id}>
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
          <span
            className='text-violet-400 ml-2'
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-controls={id}
            onKeyDown={handleKeyboard}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'show less' : 'show more'}
          </span>
        </>
      )}
    </p>
  )
}
