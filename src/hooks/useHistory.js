import { useState } from "react";

export default function useHistory() {
  const [strokes, setStrokes] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const onUndo = () => {
    if (strokes.length === 0) return;

    const removedStroke = strokes[strokes.length - 1];
    const newStrokes = strokes.slice(0, strokes.length - 1);

    setRedoStack((prev) => [...prev, removedStroke]);
    setStrokes(newStrokes);
  };

  const onRedo = () => {
    if (redoStack.length === 0) return;

    const lastStroke = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, redoStack.length - 1);

    setRedoStack(newRedoStack);
    setStrokes((prev) => [...prev, lastStroke]);
  };

  const onEraseAll = () => {
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
