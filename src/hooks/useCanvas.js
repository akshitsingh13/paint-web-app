import { useRef, useEffect } from "react";

export default function useCanvas({
  canvasRef,
  tool,
  width,
  height,
  setStrokes,
  color,
}) {
  const isMousePressed = useRef(false);
  const isDrawing = useRef(false);
  const colorRef = useRef("");
  const lastCanvasState = useRef(null);
  const isReentering = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

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
    canvas.getContext("2d", {
      willReadFrequently: true,
    });
  }, [canvasRef]);

  const handleMouseDown = (e) => {
    const context = getContext();
    isMousePressed.current = true;
    isReentering.current = false;

    lastCanvasState.current = context.getImageData(0, 0, width, height);
    context.beginPath();
    const { x, y } = getCoords(e);

    lastPoint.current = { x, y };
    context.moveTo(x, y);
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    const context = getContext();
    isMousePressed.current = false;
    isDrawing.current = false;
    isReentering.current = false;
    context.closePath();
    setStrokes((prev) => [...prev, context.getImageData(0, 0, width, height)]);
  };

  const handleMouseMove = (e) => {
    if (!isMousePressed.current) return;
    isDrawing.current = true;
    const { x, y } = getCoords(e);
    const context = getContext();

    if (isReentering.current) {
      context.moveTo(x, y);
      isReentering.current = false;
    }

    const midPointX = (lastPoint.current.x + x) / 2;
    const midPointY = (lastPoint.current.y + y) / 2;

    if (lastCanvasState.current) {
      context.putImageData(lastCanvasState.current, 0, 0);
    }

    context.globalCompositeOperation =
      tool === "brush" ? "source-over" : "destination-out";
    context.lineWidth = 5;
    context.strokeStyle = colorRef.current;
    context.lineCap = "round";
    context.lineJoin = "round";

    context.quadraticCurveTo(
      lastPoint.current.x,
      lastPoint.current.y,
      midPointX,
      midPointY,
    );
    context.stroke();
    lastPoint.current = { x, y };
  };

  const handleMouseLeave = () => {};

  const handleMouseEnter = (e) => {
    if (isMousePressed.current === true) {
      isDrawing.current = true;

      isReentering.current = true;
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isMousePressed.current = false;
      isReentering.current = false;
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
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
