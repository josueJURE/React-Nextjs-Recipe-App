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

export function DrawerScrollableContent(text: Record<string, string>) {
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button variant="outline">See more</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 ">
          {Array.from({ length: 1 }).map((_, index) => (
            <p
              key={index}
              className="style-lyra:mb-2 style-lyra:leading-relaxed mb-4 leading-normal"
            > {text.text}
         
            </p>
          ))}
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
