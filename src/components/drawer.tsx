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

export function DrawerScrollableContent({...props}: any) {
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button variant="outline">See more</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Your recipe</DrawerTitle>
          <DrawerDescription>Your recipe.</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 ">
    
            <p
              key={props.key}
              className="style-lyra:mb-2 style-lyra:leading-relaxed mb-4 leading-normal"
            > {props.text}
         
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
