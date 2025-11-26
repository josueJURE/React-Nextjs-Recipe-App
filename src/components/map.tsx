

import { MapProps } from "@/utils/types";

import World from "@react-map/world";



function Map({ handleCountrySelect, isDarkMode }: MapProps) {
  return (
    <World
      type="select-single"
      hints
      strokeColor={isDarkMode ? "#4B5563" : "#D6D6DA"}
      mapColor={isDarkMode ? "#374151" : "#EAEAEC"}
      hoverColor="#F53"
      size={500}
      onSelect={(state) => {
        handleCountrySelect(state ?? "");
      }}
      />
  );
}

export default Map;

