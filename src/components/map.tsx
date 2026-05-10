import { MapProps } from "@/utils/types";
import World from "@react-map/world";

function Map({
  handleCountrySelect,
  isDarkMode,
  selectedCountry,
  alreadySelectedCountryObject,
  size = 500,
}: MapProps) {
  const pinnedCountryColor = selectedCountry
    ? { [selectedCountry]: "#DC2626" }
    : {};
  const countryColors = {
    ...alreadySelectedCountryObject,
    ...pinnedCountryColor,
  };

  console.log("pinnedCountryColor", pinnedCountryColor);

  return (
    <World
      type="select-single"
      hints
      strokeColor={isDarkMode ? "#4B5563" : "#D6D6DA"}
      mapColor={isDarkMode ? "#374151" : "#EAEAEC"}
      hoverColor="#9CA3AF"
      selectColor=" #c75a2d"
      cityColors={countryColors}
      size={size}
      onSelect={(state) => {
        if (!state) return;
        handleCountrySelect(state);
      }}
    />
  );
}

export default Map;


/*

| Shade          | Hex       |
| -------------- | --------- |
| Light grey     | `#D1D5DB` |
| Medium grey    | `#9CA3AF` |
| Dark grey      | `#4B5563` |
| Very dark grey | `#1F2937` |



*/
