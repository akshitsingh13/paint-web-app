import useCanvas from "../hooks/useCanvas";

const Canvas = ({
  width,
  height,
  tool,
  strokes,
  setStrokes,
  color,
  brushSize,
  canvasRef,
  glow,
  setGlow,
}) => {
  // Destructure the new pointer-based handlers from your updated hook
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    handlePointerEnter,
  } = useCanvas({
    canvasRef,
    tool,
    width,
    height,
    color,
    strokes,
    setStrokes,
    brushSize,
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="border bg-white rounded-lg"
        width={width}
        height={height}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerEnter={handlePointerEnter}
      ></canvas>
    </>
  );
};

export default Canvas;
