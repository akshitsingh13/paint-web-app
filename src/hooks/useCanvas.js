import { useRef, useEffect } from "react";

export default function useCanvas({
  canvasRef,
  tool,
  width,
  height,
  setStrokes,
  color,
  brushSize,
}) {
  const isPointerPressed = useRef(false);
  const isDrawing = useRef(false);
  const colorRef = useRef("");
  const brushSizeRef = useRef(1);

  const lastCanvasState = useRef(null);
  const strokeSegments = useRef([]);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getContext = () => {
    return canvasRef.current.getContext("2d");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.getContext("2d", { willReadFrequently: true });
      canvas.style.touchAction = "none";
    }
  }, [canvasRef]);

  const handlePointerDown = (e) => {
    const context = getContext();
    isPointerPressed.current = true;

    lastCanvasState.current = context.getImageData(0, 0, width, height);

    const { x, y } = getCoords(e);
    strokeSegments.current = [[{ x, y }]];
  };

  const handlePointerUp = () => {
    if (!isDrawing.current) {
      isPointerPressed.current = false;
      strokeSegments.current = [];
      return;
    }
    const context = getContext();
    isPointerPressed.current = false;
    isDrawing.current = false;
    strokeSegments.current = [];

    setStrokes((prev) => [...prev, context.getImageData(0, 0, width, height)]);
  };

  const handlePointerMove = (e) => {
    if (!isPointerPressed.current) return;
    isDrawing.current = true;

    const { x, y } = getCoords(e);
    const context = getContext();

    const currentSegmentIndex = strokeSegments.current.length - 1;
    if (currentSegmentIndex >= 0) {
      strokeSegments.current[currentSegmentIndex].push({ x, y });
    }

    if (lastCanvasState.current) {
      context.putImageData(lastCanvasState.current, 0, 0);
    }

    context.globalCompositeOperation =
      tool === "brush" ? "source-over" : "destination-out";
    context.lineWidth = brushSizeRef.current;
    context.strokeStyle = colorRef.current;
    context.lineCap = "round";
    context.lineJoin = "round";

    strokeSegments.current.forEach((points) => {
      if (points.length < 1) return;

      context.beginPath();
      context.moveTo(points[0].x, points[0].y);

      if (points.length === 1) {
        context.lineTo(points[0].x, points[0].y);
        context.stroke();
        return;
      }

      for (let i = 1; i < points.length - 1; i++) {
        const midPointX = (points[i].x + points[i + 1].x) / 2;
        const midPointY = (points[i].y + points[i + 1].y) / 2;
        context.quadraticCurveTo(
          points[i].x,
          points[i].y,
          midPointX,
          midPointY,
        );
      }

      context.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      context.stroke();
    });
  };

  const handlePointerLeave = () => {};

  const handlePointerEnter = (e) => {
    if (isPointerPressed.current) {
      const { x, y } = getCoords(e);
      strokeSegments.current.push([{ x, y }]);
    }
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isPointerPressed.current) {
        handlePointerUp();
      }
    };

    document.addEventListener("pointerup", handleGlobalPointerUp);
    return () => {
      document.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [width, height]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    handlePointerEnter,
  };
}
