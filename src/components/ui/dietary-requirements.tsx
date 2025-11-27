import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


function DietaryRequirements() {
  return (
    <div>
      <h1>Indicate any diatery requirements</h1>
      <div className="flex items-center gap-4 pt-4">
        <Label htmlFor="vegan">Vegan</Label>
        <Input className="h-4" id="vegan" type="checkbox"></Input>
        <Label htmlFor="other">Other</Label>
        <Input className="h-4" id="other" type="checkbox"></Input>
      </div>
    </div>
  );
}

export default DietaryRequirements;
