import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface DrawerInterface {
  text: string;
}



export function DrawerScrollableContent({ ...props }: DrawerInterface) {
    {console.log("split", props.text.split(""))}
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button variant="outline">See more</Button>
      </DrawerTrigger>
      <DrawerContent className="bg-amber-400">
        <DrawerHeader>
          <DrawerTitle>Your recipe</DrawerTitle>
          <DrawerDescription>Your recipe.</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 space-y-10 ">
          <p className="style-lyra:mb-2 style-lyra:leading-relaxed mb-4 leading-normal">
            {" "}

   
         
            {props.text.split("-").map((el, index) => (
                el === "-" || el === "1" || el === "2" || el === "3" || el === "4" || el === "5" || el === "6" || el === "7" || el === "8" || el === "9" ? <br></br>: <span key={index}>{el}</span>
            
            
    
               
            ))}
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
