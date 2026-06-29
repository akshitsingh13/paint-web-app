import { useState } from "react";

export default function useHistory(canvasRef) {
  const [strokes, setStrokes] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

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

  return {
    strokes,
    redoStack,
    setStrokes,
    onUndo,
    onRedo,
    onEraseAll,
  };
}
