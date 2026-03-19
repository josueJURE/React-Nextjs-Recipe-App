"use client";

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

import type { ReadMoreProps } from "@/utils/types";
import { RiDeleteBin6Line } from "react-icons/ri";

export function ReadMore({
  id,
  text,
  date,
  amountOfWords = 50,
  onDelete,
}: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = text.trim().split(/\s+/);
  const itCanOverFlow = words.length > amountOfWords;
  const beginText = itCanOverFlow
    ? words.slice(0, amountOfWords).join(" ")
    : text;
  const endText = itCanOverFlow ? words.slice(amountOfWords).join(" ") : "";
  const contentId = `${id}-content`;
  const parsedDate = new Date(date);

  const displayDate = formatDatefunction(parsedDate);

  const handleDeleteClick = async () => {
    if (!onDelete || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(id);
    } finally {
      setIsDeleting(false);
    }
  };

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
        <CardFooter className="display: inline-flex space-x-80">
          <Button
            className="text-blue-400"
            aria-expanded={isExpanded}
            aria-controls={contentId}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            {isExpanded ? "show less" : "show more"}
          </Button>
          <button
            type="button"
            aria-label="Delete recipe"
            disabled={isDeleting || !onDelete}
            onClick={handleDeleteClick}
          >
            <RiDeleteBin6Line />
          </button>
        </CardFooter>
      )}
    </Card>
  );
}
