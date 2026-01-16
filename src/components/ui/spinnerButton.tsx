import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type SpinnerButtonProps = {
  label: string;
};



export function SpinnerButton({label}: SpinnerButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size="sm">
        <Spinner />
        {label}
      </Button>
    </div>
  );
}
