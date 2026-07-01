import { useState } from "react";
import Tool from "./Tool";

const ShapesTool = ({ tool, setTool }) => {
  const ShapeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-shapes-icon lucide-shapes"
    >
      <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <circle cx="17.5" cy="17.5" r="3.5" />
    </svg>
  );
  const SquareIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-square-icon lucide-square"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
  const CircleIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-circle-icon lucide-circle"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
  const [isShape, setIsShape] = useState(false);

  const handleSquare = () => {
    setTool("square");
  };
  const handleCircle = () => {
    setTool("circle");
  };
  return (
    <div className="dropdown dropdown-center">
      <div
        className={`${tool === "square" || tool === "circle" ? "aura aura-sm" : ""}`}
      >
        <div tabIndex={0} role="button" className="btn m-1">
          {ShapeIcon}
        </div>
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content bg-gray-600 rounded-box shadow p-1 flex flex-col gap-1 "
      >
        <Tool
          label={SquareIcon}
          onClick={handleSquare}
          active={tool === "square"}
        />
        <Tool
          label={CircleIcon}
          onClick={handleCircle}
          active={tool === "circle"}
        />
      </ul>
    </div>
  );
};

export default ShapesTool;
