const BrushSizeSlider = ({ brushSize, setBrushSize }) => {
  const handleChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= 100) {
      setBrushSize(value);
    } else if (e.target.value === "") {
      setBrushSize("");
    }
  };
  return (
    <>
      <div className="flex flex-col gap-4 align-middle justify-center items-center">
        <div className="flex gap-4 align-middle justify-center items-center">
          <p>Brush Size</p>
          <input
            type="number"
            min={1}
            max={100}
            value={brushSize}
            onChange={handleChange}
            className="input input-bordered w-16"
            placeholder="Size"
            onBlur={(e) => {
              if (brushSize === "" || brushSize < 1) setBrushSize(5);
            }}
          />
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={brushSize || 1}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="range range-sm"
        />
      </div>
    </>
  );
};

export default BrushSizeSlider;
