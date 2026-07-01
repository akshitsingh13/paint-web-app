import { useState } from "react";
import ThemeSelector from "./ThemeSelector";
import { PALETTES } from "./palettes";

const ColorPalette = ({ color, setColor }) => {
  const [currentTheme, setCurrentTheme] = useState(0);
  const colors = PALETTES[currentTheme].colors;

  return (
    <div className="space-y-3">
      <ThemeSelector
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
      />

      <div className="grid grid-cols-4 gap-2 w-fit">
        {colors.map((paletteColor) => (
          <button
            key={paletteColor}
            onClick={() => setColor(paletteColor)}
            className={`w-8 h-8 rounded-full border-2 transition hover:cursor-pointer hover:scale-105 ${
              color === paletteColor
                ? "border-primary scale-110 shadow-md"
                : "border-base-300"
            }`}
            style={{ backgroundColor: paletteColor.slice(0, 7) }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
