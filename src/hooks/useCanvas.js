import { useRef, useEffect, use } from "react";

export default function useCanvas({
  canvasRef,
  tool,
  width,
  height,
  setStrokes,
  opacity,
  color,
}) {
  const isMousePressed = useRef(false);
  const isDrawing = useRef(false);
  const colorRef = useRef("");
  const globalAlpha = useRef(1);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    globalAlpha.current = opacity;
    console.log(globalAlpha.current);
  }, [opacity]);
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const getContext = () => {
    return canvasRef.current.getContext("2d");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", {
      willReadFrequently: true,
    });
  }, []);

  const handleMouseDown = (e) => {
    const context = getContext();
    isMousePressed.current = true;
    context.beginPath();
    const { x, y } = getCoords(e);
    context.moveTo(x, y);
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    const context = getContext();
    isMousePressed.current = false;
    isDrawing.current = false;
    if (isDrawing.current === false) {
      context.closePath();
    }
    setStrokes((prev) => [...prev, context.getImageData(0, 0, width, height)]);
  };

  const handleMouseMove = (e) => {
    isDrawing.current = true;
    const { x, y } = getCoords(e);
    const context = getContext();

    context.globalCompositeOperation =
      tool === "brush" ? "source-over" : "destination-out";
    context.lineWidth = 5; // MAKE THIS DYNAMIC INTO A SLIDER
    context.strokeStyle = colorRef.current;
    context.globalAlpha = globalAlpha.current;
    context.lineCap = "round";
    context.lineJoin = "round";
    if (isMousePressed.current) {
      context.lineTo(x, y);
      context.stroke();
      context.beginPath();
      context.moveTo(x, y);
    }
  };

  const handleMouseLeave = () => {
    const context = getContext();
    isDrawing.current = false;
    context.closePath();
  };

  const handleMouseEnter = (e) => {
    const context = getContext();
    if (isMousePressed.current === true) {
      isDrawing.current = true;
      context.beginPath();
      const { x, y } = getCoords(e);
      context.moveTo(x, y);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isMousePressed.current = false;
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleMouseEnter,
  };
}
