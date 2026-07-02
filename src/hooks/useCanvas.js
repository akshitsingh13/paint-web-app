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

  // getCoords now accounts for the canvas being displayed at a different
  // CSS size than its internal pixel resolution (width/height props).
  // On mobile/tablet the canvas is scaled down via CSS (see Canvas.jsx),
  // so we map the pointer position from "displayed" space back into
  // "internal drawing" space. On desktop, where CSS size === pixel size,
  // scaleX/scaleY are simply 1, so this is a no-op and behavior is
  // identical to before.
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
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

  const drawFreehand = (context, stroke) => {
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
  };

  const drawRectangle = (context, stroke) => {
    const { start, end } = stroke;
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const w = Math.abs(end.x - start.x);
    const h = Math.abs(end.y - start.y);
    context.strokeRect(x, y, w, h);
  };

  const drawCircle = (context, stroke) => {
    const { start, end } = stroke;
    const cx = (start.x + end.x) / 2;
    const cy = (start.y + end.y) / 2;
    const rx = Math.abs(end.x - start.x) / 2;
    const ry = Math.abs(end.y - start.y) / 2;

    context.beginPath();
    context.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    context.stroke();
  };

  const drawLine = (context, stroke) => {
    const { start, end } = stroke;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  };

  const drawRAT = (context, stroke) => {
    const { start, end } = stroke;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(start.x, end.y);
    context.lineTo(end.x, end.y);
    context.closePath();
    context.stroke();
  };

  const drawTriangle = (context, stroke) => {
    const { start, end } = stroke;

    const baseY = end.y;
    const apexX = (start.x + end.x) / 2;
    const baseWidth = end.x - start.x;
    const triangleHeight = Math.abs(baseWidth) * (Math.sqrt(3) / 2);
    const apexY = end.y - triangleHeight;

    context.beginPath();
    context.moveTo(start.x, baseY);
    context.lineTo(end.x, baseY);
    context.lineTo(apexX, apexY);
    context.closePath();
    context.stroke();
  };

  const drawStroke = (context, stroke) => {
    context.save();
    context.lineWidth = stroke.size;
    context.strokeStyle = stroke.color;
    context.lineCap = "round";
    context.lineJoin = "round";

    switch (stroke.tool) {
      case "brush":
        context.globalCompositeOperation = "source-over";
        drawFreehand(context, stroke);
        break;
      case "eraser":
        context.globalCompositeOperation = "destination-out";
        drawFreehand(context, stroke);
        break;
      case "rectangle":
        context.globalCompositeOperation = "source-over";
        drawRectangle(context, stroke);
        break;
      case "circle":
        context.globalCompositeOperation = "source-over";
        drawCircle(context, stroke);
        break;
      case "line":
        context.globalCompositeOperation = "source-over";
        drawLine(context, stroke);
        break;
      case "rat":
        context.globalCompositeOperation = "source-over";
        drawRAT(context, stroke);
        break;
      case "triangle":
        context.getBoundingClientOperation = "source-over";
        drawTriangle(context, stroke);
        break;
    }

    context.restore();
  };

  const redrawAll = () => {
    const context = getContext();
    if (!context) return;

    context.clearRect(0, 0, width, height);

    context.save();
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.restore();

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
    if (toolRef.current === "brush" || toolRef.current === "eraser") {
      currentStroke.current = {
        tool: toolRef.current,
        color: colorRef.current,
        size: brushSizeRef.current,
        segments: [[{ x, y }]],
      };
    } else {
      currentStroke.current = {
        tool: toolRef.current,
        color: colorRef.current,
        size: brushSizeRef.current,
        start: { x, y },
        end: { x, y },
      };
    }
  };

  const handlePointerUp = () => {
    isPointerPressed.current = false;

    const finishedStroke = currentStroke.current;
    isDrawing.current = false;
    currentStroke.current = null;

    if (finishedStroke) {
      setStrokes((prev) => [...prev, finishedStroke]);
    }
  };

  const handlePointerMove = (e) => {
    if (!isPointerPressed.current || !currentStroke.current) return;
    isDrawing.current = true;

    const { x, y } = getCoords(e);

    if (toolRef.current === "brush" || toolRef.current === "eraser") {
      const currentSegmentIndex = currentStroke.current.segments.length - 1;
      if (currentSegmentIndex >= 0) {
        currentStroke.current.segments[currentSegmentIndex].push({ x, y });
      }
    } else {
      currentStroke.current.end = { x, y };
    }

    redrawAll();
  };

  const handlePointerLeave = () => {
    canvasRef.current.style.cursor = "default";
  };

  const handlePointerEnter = (e) => {
    if (
      isPointerPressed.current &&
      currentStroke.current &&
      (toolRef.current === "brush" || toolRef.current === "eraser")
    ) {
      const { x, y } = getCoords(e);
      currentStroke.current.segments.push([{ x, y }]);
    }

    canvasRef.current.style.cursor =
      toolRef.current === "pointer"
        ? "default"
        : makeCircularCursor(brushSizeRef.current);
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
