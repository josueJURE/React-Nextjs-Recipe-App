"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";


type AlertDialogCompomentProps = {
  onConfirm: () => void | Promise<void>;
  trigger?: React.ReactNode;
  title: string;
  description: string;
  cancelLabel?: string;
  actionLabel?: string;
  actionLoadingLabel?: string;
  buttonLabel?: string;
  disabled?: boolean;
};



export function AlertDialogCompoment({
  onConfirm,
  trigger,
  title,
  description,
  cancelLabel = "Cancel",
  actionLabel = "Continue",
  actionLoadingLabel = "Loading...",
  disabled = false,

}: AlertDialogCompomentProps) {
  const [open, setOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const isDisabled = disabled || isConfirming;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDisabled) {
      return;
    }

    setOpen(nextOpen);
  };

  const handleConfirm = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (isDisabled) {
      return;
    }

    try {
      setIsConfirming(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger ?? <Button variant="outline"></Button>}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDisabled}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            aria-busy={isDisabled}
            disabled={isDisabled}
            onClick={handleConfirm}
          >
            {isDisabled ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {actionLoadingLabel}
              </>
            ) : (
              actionLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
  
