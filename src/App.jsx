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
  const handlePointerTool = () => {
    setTool("pointer");
  };
  const handleRectangle = () => {
    setTool("rectangle");
  };
  const handleCircle = () => {
    setTool("circle");
  };
  const handleLine = () => {
    setTool("line");
  };
  const handleRightAngleTriangle = () => {
    setTool("rat");
  };
  const handleTriangle = () => {
    setTool("triangle");
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
  const SaveIcon = (
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
      class="lucide lucide-download-icon lucide-download"
    >
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
  const PointerIcon = (
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
      class="lucide lucide-mouse-pointer-icon lucide-mouse-pointer"
    >
      <path d="M12.586 12.586 19 19" />
      <path d="M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z" />
    </svg>
  );
  const RectangleIcon = (
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
      class="lucide lucide-rectangle-horizontal-icon lucide-rectangle-horizontal"
    >
      <rect width="20" height="12" x="2" y="6" rx="2" />
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
  const LineIcon = (
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
      class="lucide lucide-slash-icon lucide-slash"
    >
      <path d="M22 2 2 22" />
    </svg>
  );
  const RATIcon = (
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
      class="lucide lucide-triangle-right-icon lucide-triangle-right"
    >
      <path d="M22 18a2 2 0 0 1-2 2H3c-1.1 0-1.3-.6-.4-1.3L20.4 4.3c.9-.7 1.6-.4 1.6.7Z" />
    </svg>
  );
  const TriangleIcon = (
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
      class="lucide lucide-triangle-icon lucide-triangle"
    >
      <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    </svg>
  );

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const userInput = window.prompt("Enter a file name:", "drawing");
    if (userInput === null) return;
    const fileName = userInput.trim() || "drawing";
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = fileName;
    link.click();
  };

  return (
    <>
      <div className="flex justify-center align-middle items-center p-2 gap-4 h-screen">
        <div className="flex gap-4">
          <div className="flex gap-4 flex-col">
            <div className="flex flex-col gap-4">
              <HexAlphaColorPicker
                className="my-picker"
                color={color}
                onChange={setColor}
              />
              <div className="flex gap-4 items-center">
                <p>Color</p>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="input input-bordered mt-2 w-32"
                />
              </div>
            </div>
            <BrushSizeSlider
              brushSize={brushSize}
              setBrushSize={setBrushSize}
            />
            <ColorPalette color={color} setColor={setColor} />
          </div>

          <div className="flex flex-col gap-4">
            <Tool
              label={PointerIcon}
              onClick={handlePointerTool}
              active={tool === "pointer"}
            />
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
              label={RectangleIcon}
              onClick={handleRectangle}
              active={tool === "rectangle"}
            />

            <Tool
              label={CircleIcon}
              onClick={handleCircle}
              active={tool === "circle"}
            />
            <Tool
              label={LineIcon}
              onClick={handleLine}
              active={tool === "line"}
            />
            <Tool
              label={RATIcon}
              onClick={handleRightAngleTriangle}
              active={tool === "rat"}
            />
            <Tool
              label={TriangleIcon}
              onClick={handleTriangle}
              active={tool === "triangle"}
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
            <Tool label={SaveIcon} onClick={downloadImage} />
          </div>
        </div>

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
    </>
  );
}

export default App;
