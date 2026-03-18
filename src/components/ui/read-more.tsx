import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { formatDatefunction } from "@/utils/helper-functions/helper-functions";

import { ReadMoreProps  } from "@/utils/types";



export function ReadMore({
  id,
  text,
  date,
  amountOfWords = 50,
}: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const words = text.trim().split(/\s+/);
  const itCanOverFlow = words.length > amountOfWords;
  const beginText = itCanOverFlow
    ? words.slice(0, amountOfWords).join(" ")
    : text;
  const endText = itCanOverFlow ? words.slice(amountOfWords).join(" ") : "";
  const contentId = `${id}-content`;
  const parsedDate = new Date(date);

  const displayDate = formatDatefunction(parsedDate);

  return (
    <Card id={id}>
      <CardHeader>
        <CardDescription>{displayDate}</CardDescription>
      </CardHeader>
      <CardContent id={contentId}>
        <p>
          {beginText}
          {itCanOverFlow && !isExpanded ? "..." : ""}
          {itCanOverFlow && isExpanded && endText ? ` ${endText}` : ""}
        </p>
      </CardContent>

      {itCanOverFlow && (
        <CardFooter>
          <Button
            className="text-blue-400"
            aria-expanded={isExpanded}
            aria-controls={contentId}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            {isExpanded ? "show less" : "show more"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
