import { useRef, useState } from "react";
import "./App.css";
import useHistory from "./hooks/useHistory";

import Canvas from "./components/Canvas";
import Tool from "./components/Tool";

function App() {
  const [tool, setTool] = useState("brush");
  const [strokes, setStrokes] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const canvasRef = useRef(null);

  const onUndo = () => {
    if (strokes.length === 0) return;

    const removedStroke = strokes[strokes.length - 1];
    const newStrokes = strokes.slice(0, strokes.length - 1);

    setRedoStack((prev) => [...prev, removedStroke]);
    setStrokes(newStrokes);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (newStrokes.length === 0) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      context.putImageData(newStrokes[newStrokes.length - 1], 0, 0);
    }
  };

  const onRedo = () => {
    if (redoStack.length === 0) return;

    const lastStroke = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, redoStack.length - 1);
    setRedoStack(newRedoStack);
    setStrokes([...strokes, lastStroke]);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.putImageData(lastStroke, 0, 0);
  };

  const onEraseAll = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setRedoStack([]);
  };

  const handleBrushTool = () => {
    setTool("brush");
  };
  const handleEraserTool = () => {
    setTool("eraser");
  };
  return (
    <>
      <div className="flex justify-center align-middle items-center gap-4 h-screen">
        <div className="flex flex-col gap-4">
          <Tool label="Brush" onClick={handleBrushTool} />
          <Tool label="Eraser" onClick={handleEraserTool} />
          <Tool label="Undo" onClick={onUndo} disabled={strokes.length === 0} />
          <Tool
            label={"Redo"}
            onClick={onRedo}
            disabled={redoStack.length === 0}
          />
          <Tool label="Erase All" onClick={onEraseAll} />
        </div>
        <div>
          <Canvas
            canvasRef={canvasRef}
            width={700}
            height={500}
            tool={tool}
            setStrokes={setStrokes}
          />
        </div>
      </div>
    </>
  );
}

export default App;
