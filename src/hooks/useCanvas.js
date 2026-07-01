import { useRef, useEffect } from "react";

export default function useCanvas({
  canvasRef,
  tool,
  width,
  height,
  strokes,
  setStrokes,
  color,
  brushSize,
}) {
  const isPointerPressed = useRef(false);
  const isDrawing = useRef(false);
  const colorRef = useRef("");
  const brushSizeRef = useRef(1);
  const toolRef = useRef("brush");

  const ctxRef = useRef(null);

  const strokesRef = useRef([]);

  const currentStroke = useRef(null);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    brushSizeRef.current = brushSize;
  }, [brushSize]);

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getContext = () => ctxRef.current;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext("2d", { willReadFrequently: true });
      canvas.style.touchAction = "none";
    }
  }, [canvasRef]);

  function makeCircularCursor(size, color = "black") {
    const crosshairSize = 8;
    const radius = size / 2;
    const canvasSize = Math.max(size, crosshairSize) + 4;
    const center = canvasSize / 2;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}">
    ${
      size >= 4
        ? `<circle cx="${center}" cy="${center}" r="${radius - 1}"
      fill="none" stroke="${color}" stroke-width="1"/>`
        : ""
    }
    <line x1="${center - crosshairSize / 2}" y1="${center}" x2="${center + crosshairSize / 2}" y2="${center}"
      stroke="${color}" stroke-width="1"/>
    <line x1="${center}" y1="${center - crosshairSize / 2}" x2="${center}" y2="${center + crosshairSize / 2}"
      stroke="${color}" stroke-width="1"/>
  </svg>`;

    const encoded = encodeURIComponent(svg);
    return `url("data:image/svg+xml;utf8,${encoded}") ${center} ${center}, auto`;
  }

  const drawStroke = (context, stroke) => {
    context.save();

    context.globalCompositeOperation =
      stroke.tool === "brush" ? "source-over" : "destination-out";
    context.lineWidth = stroke.size;
    context.strokeStyle = stroke.color;
    context.lineCap = "round";
    context.lineJoin = "round";

    stroke.segments.forEach((points) => {
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

    context.restore();
  };

  const redrawAll = () => {
    const context = getContext();
    if (!context) return;

    context.clearRect(0, 0, width, height);

    strokesRef.current.forEach((stroke) => drawStroke(context, stroke));

    if (currentStroke.current) {
      drawStroke(context, currentStroke.current);
    }
  };

  useEffect(() => {
    strokesRef.current = strokes;
    redrawAll();
  }, [strokes]);

  const handlePointerDown = (e) => {
    isPointerPressed.current = true;

    const { x, y } = getCoords(e);
    currentStroke.current = {
      tool: toolRef.current,
      color: colorRef.current,
      size: brushSizeRef.current,
      segments: [[{ x, y }]],
    };
  };

  const handlePointerUp = () => {
    if (!isDrawing.current) {
      isPointerPressed.current = false;
      currentStroke.current = null;
      return;
    }
    isPointerPressed.current = false;
    isDrawing.current = false;

    const finishedStroke = currentStroke.current;
    currentStroke.current = null;

    if (finishedStroke) {
      setStrokes((prev) => [...prev, finishedStroke]);
    }
  };

  const handlePointerMove = (e) => {
    if (!isPointerPressed.current || !currentStroke.current) return;
    isDrawing.current = true;

    const { x, y } = getCoords(e);

    const currentSegmentIndex = currentStroke.current.segments.length - 1;
    if (currentSegmentIndex >= 0) {
      currentStroke.current.segments[currentSegmentIndex].push({ x, y });
    }

    redrawAll();
  };

  const handlePointerLeave = () => {
    canvasRef.current.style.cursor = "default";
  };

  const handlePointerEnter = (e) => {
    if (isPointerPressed.current && currentStroke.current) {
      const { x, y } = getCoords(e);
      currentStroke.current.segments.push([{ x, y }]);
    }
    canvasRef.current.style.cursor = makeCircularCursor(brushSizeRef.current);
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
