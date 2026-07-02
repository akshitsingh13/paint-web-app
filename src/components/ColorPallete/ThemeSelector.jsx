import { useState, useRef, useEffect } from "react";
import { PALETTES } from "./palettes";

const ThemeSelector = ({ currentTheme, setCurrentTheme }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn btn-outline w-full justify-between text-base font-normal"
      >
        <span className="flex items-center gap-2">
          <span className="flex overflow-hidden rounded-full border border-base-300 w-5 h-5">
            {PALETTES[currentTheme].colors.slice(0, 4).map((c) => (
              <span
                key={c}
                className="flex-1"
                style={{ backgroundColor: c.slice(0, 7) }}
              />
            ))}
          </span>
          {PALETTES[currentTheme].name}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-60 rounded-box bg-base-200 border border-base-300 p-2 shadow-xl">
          {PALETTES.map((theme, index) => (
            <button
              key={theme.name}
              onClick={() => {
                setCurrentTheme(index);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-base-300 ${
                currentTheme === index ? "bg-base-300" : ""
              }`}
            >
              <span className="text-sm font-medium w-14 shrink-0 text-left">
                {theme.name}
              </span>
              <div className="flex gap-1">
                {theme.colors.map((color) => (
                  <div
                    key={color}
                    className="h-3.5 w-3.5 rounded-full border border-base-content/10 shrink-0"
                    style={{ backgroundColor: color.slice(0, 7) }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
