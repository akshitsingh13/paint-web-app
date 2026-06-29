import { useRef, useEffect, useState } from "react";
import useCanvas from "../hooks/useCanvas";

const Canvas = ({ width, height, tool, setStrokes, color, canvasRef }) => {
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleMouseEnter,
  } = useCanvas({
    canvasRef,
    tool,
    width,
    height,
    color,
    setStrokes,
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="border"
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      ></canvas>
    </>
  );
};

export default Canvas;
