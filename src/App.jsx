import { useRef, useState } from "react";
import "./App.css";
import useHistory from "./hooks/useHistory";

import { HexAlphaColorPicker } from "react-colorful";

import Canvas from "./components/Canvas";
import Tool from "./components/Tool";
import BrushSizeSlider from "./components/BrushSizeSlider";
import ColorPalette from "./components/ColorPallete/ColorPallete";

function App() {
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#000000ff");
  const [brushSize, setBrushSize] = useState(5);

  const canvasRef = useRef(null);

  const { strokes, redoStack, setStrokes, onUndo, onRedo, onEraseAll } =
    useHistory();

  const handleBrushTool = () => {
    setTool("brush");
  };
  const handleEraserTool = () => {
    setTool("eraser");
  };

  const BrushIcon = (
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
      class="lucide lucide-brush-icon lucide-brush"
    >
      <path d="m11 10 3 3" />
      <path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z" />
      <path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031" />
    </svg>
  );
  const EraserIcon = (
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
      class="lucide lucide-eraser-icon lucide-eraser"
    >
      <path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" />
      <path d="m5.082 11.09 8.828 8.828" />
    </svg>
  );
  const UndoIcon = (
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
      class="lucide lucide-undo-icon lucide-undo"
    >
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
  const RedoIcon = (
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
      class="lucide lucide-redo-icon lucide-redo"
    >
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </svg>
  );
  const ResetIcon = (
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
      class="lucide lucide-trash2-icon lucide-trash-2"
    >
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );

  return (
    <>
      <div className="flex justify-center align-middle items-center gap-4 h-screen">
        <div className="flex gap-4">
          <div className="flex gap-4 flex-col">
            <HexAlphaColorPicker
              className="my-picker"
              color={color}
              onChange={setColor}
            />
            <BrushSizeSlider
              brushSize={brushSize}
              setBrushSize={setBrushSize}
            />
            <ColorPalette color={color} setColor={setColor} />
          </div>

          <div className="flex flex-col gap-4">
            <Tool
              label={BrushIcon}
              onClick={handleBrushTool}
              active={tool === "brush"}
            />
            <Tool
              label={EraserIcon}
              onClick={handleEraserTool}
              active={tool === "eraser"}
            />
            <Tool
              label={UndoIcon}
              onClick={onUndo}
              disabled={strokes.length === 0}
            />
            <Tool
              label={RedoIcon}
              onClick={onRedo}
              disabled={redoStack.length === 0}
            />
            <Tool label={ResetIcon} onClick={onEraseAll} />
          </div>
        </div>

        <div>
          <Canvas
            canvasRef={canvasRef}
            width={700}
            height={500}
            tool={tool}
            color={color}
            strokes={strokes}
            setStrokes={setStrokes}
            brushSize={brushSize}
          />
        </div>
      </div>
    </>
  );
}

export default App;
