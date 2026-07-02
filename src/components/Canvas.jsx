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
      {/*
        The canvas keeps its internal pixel resolution fixed at `width`x`height`
        (via the HTML width/height attributes) so drawing logic and stroke
        coordinates never change. Only the *displayed* CSS size shrinks to fit
        smaller viewports, constrained by aspect-ratio so it never distorts.
        useCanvas's getCoords() compensates for any CSS-vs-pixel size difference,
        so pointer coordinates stay accurate at every screen size.
      */}
      <canvas
        ref={canvasRef}
        className="border bg-white rounded-lg w-full h-auto lg:w-auto lg:h-auto touch-none"
        style={{
          aspectRatio: `${width} / ${height}`,
          maxWidth: `${width}px`,
          maxHeight: "80vh",
        }}
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
