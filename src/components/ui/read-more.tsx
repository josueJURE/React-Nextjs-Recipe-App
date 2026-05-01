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
import { bodyTextClassName, themeColor } from "@/utils/const";

import type { ReadMoreProps } from "@/utils/types";
import { Trash2 } from "lucide-react";

import { AlertDialogCompoment } from "@/components/dialog";

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
    <Card
      id={id}
      className="gap-4 rounded-[1.35rem] border-[#efe5dc] bg-[#fffdfa] py-0 shadow-[0_14px_35px_-28px_rgba(81,52,34,0.55)]"
    >
      <CardHeader className="px-5 pt-5 pb-0">
        <CardDescription className="text-base font-medium text-[#8b7d74]">
          {displayDate}
        </CardDescription>
      </CardHeader>
      <CardContent id={contentId} className="px-5">
        <p className={`${bodyTextClassName} text-base leading-7 sm:text-lg`}>
          {beginText}
          {itCanOverFlow && !isExpanded ? "..." : ""}
          {itCanOverFlow && isExpanded && endText ? ` ${endText}` : ""}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 px-5 pb-5">
        {itCanOverFlow ? (
          <Button
            variant="ghost"
            className="h-10 rounded-[1rem] px-4 text-base font-semibold hover:bg-[#fcf5ef]"
            style={{ color: themeColor }}
            aria-expanded={isExpanded}
            aria-controls={contentId}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        ) : (
          <span aria-hidden="true" />
        )}

        <AlertDialogCompoment
          onConfirm={handleDeleteClick}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Delete recipe"
              disabled={isDeleting || !onDelete}
              className="size-10 rounded-full text-[#8b3b26] hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="size-4" />
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
