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
      <input
        type="range"
        min={1}
        max={100}
        value={brushSize || 1}
        onChange={(e) => setBrushSize(Number(e.target.value))}
        className="range range-sm"
      />
      <input
        type="number"
        min={1}
        max={100}
        value={brushSize}
        onChange={handleChange}
        className="input input-bordered w-full"
        placeholder="Size"
        onBlur={(e) => {
          if (brushSize === "" || brushSize < 1) setBrushSize(5);
        }}
      />
    </>
  );
};

export default BrushSizeSlider;
