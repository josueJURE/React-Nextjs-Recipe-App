import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function AudioSpinnerButton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size="sm">
        <Spinner />
        Loading  Audio
      </Button>
    </div>
  );
}
