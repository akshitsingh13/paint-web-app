import { useRef, useState } from "react";
import "./App.css";
import useHistory from "./hooks/useHistory";

import { HexAlphaColorPicker } from "react-colorful";

import Canvas from "./components/Canvas";
import Tool from "./components/Tool";
import BrushSizeSlider from "./components/BrushSizeSlider";

function App() {
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("000000ff");
  const [brushSize, setBrushSize] = useState(5);

  const canvasRef = useRef(null);

  const { strokes, redoStack, setStrokes, onUndo, onRedo, onEraseAll } =
    useHistory(canvasRef);

  const handleBrushTool = () => {
    setTool("brush");
  };
  const handleEraserTool = () => {
    setTool("eraser");
  };
  return (
    <>
      <div className="flex justify-center align-middle items-center gap-4 h-screen">
        <div className="flex gap-4">
          <HexAlphaColorPicker
            className="my-picker"
            color={color}
            onChange={setColor}
          />
          <BrushSizeSlider brushSize={brushSize} setBrushSize={setBrushSize} />
          <div className="flex flex-col gap-4">
            <Tool label="Brush" onClick={handleBrushTool} />
            <Tool label="Eraser" onClick={handleEraserTool} />
            <Tool
              label="Undo"
              onClick={onUndo}
              disabled={strokes.length === 0}
            />
            <Tool
              label={"Redo"}
              onClick={onRedo}
              disabled={redoStack.length === 0}
            />
            <Tool label="Erase All" onClick={onEraseAll} />
          </div>
        </div>

        <div>
          <Canvas
            canvasRef={canvasRef}
            width={700}
            height={500}
            tool={tool}
            color={color}
            setStrokes={setStrokes}
            brushSize={brushSize}
          />
        </div>
      </div>
    </>
  );
}

export default App;
