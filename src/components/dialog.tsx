"use client";


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
  onConfirm: () => void;
  trigger?: React.ReactNode;
  title: string;
  description: string;
  cancelLabel?: string;
  actionLabel?: string;
  buttonLabel?: string;
};

export function AlertDialogCompoment({
  onConfirm,
  trigger,
  title,
  description,
  cancelLabel = "Cancel",
  actionLabel = "Continue",

}: AlertDialogCompomentProps) {
  return (
    <AlertDialog>
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
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
  
