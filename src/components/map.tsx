

import { MapProps } from "@/utils/types";

import World from "@react-map/world";



function Map({ handleCountrySelect, isDarkMode, selectedCountry, arrayselectedCountry}: MapProps) {
  const pinnedCountryColor = selectedCountry ? { [selectedCountry]: "#DC2626" } : {};

  // implement functionality to retrieve array of alreday selected countires from db and pin them

  console.log("pinnedCountryColor", pinnedCountryColor)

  return (
    <World
      type="select-single"
      hints
      strokeColor={isDarkMode ? "#4B5563" : "#D6D6DA"}
      mapColor={isDarkMode ? "#374151" : "#EAEAEC"}
      hoverColor="#F53"
      selectColor="#DC2626"
      cityColors={pinnedCountryColor}
      size={500}
      onSelect={(state) => {
        if (!state) return;
        handleCountrySelect(state);
        arrayselectedCountry
      }}
      />
  );
}

export default Map;
