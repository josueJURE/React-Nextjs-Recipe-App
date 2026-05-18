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
      className="gap-4 rounded-lg border-[#dfe8dd] bg-white/95 py-0 shadow-[0_14px_35px_-30px_rgba(36,56,45,0.5)]"
    >
      <CardHeader className="px-4 pt-4 pb-0 sm:px-5 sm:pt-5">
        <CardDescription className="text-sm font-medium text-[#657167] sm:text-base">
          {displayDate}
        </CardDescription>
      </CardHeader>
      <CardContent id={contentId} className="px-4 sm:px-5">
        <p className={bodyTextClassName}>
          {beginText}
          {itCanOverFlow && !isExpanded ? "..." : ""}
          {itCanOverFlow && isExpanded && endText ? ` ${endText}` : ""}
        </p>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 px-4 pb-4 sm:px-5 sm:pb-5">
        {itCanOverFlow ? (
          <Button
            variant="ghost"
            className="min-h-11 rounded-md px-4 text-sm font-semibold hover:bg-[#f2f7f3] sm:text-base"
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
          title="Delete recipe?"
          description="This action cannot be undone."
          actionLabel="Delete"
          actionLoadingLabel="Deleting..."
          disabled={isDeleting}
          onConfirm={handleDeleteClick}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Delete recipe"
              disabled={isDeleting || !onDelete}
              className="size-11 rounded-md text-[#8b3b26] hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className={isDeleting ? "size-4 animate-pulse" : "size-4"} />
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
