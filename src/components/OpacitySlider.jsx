const OpacitySlider = ({ opacity, setOpacity }) => {
  return (
    <>
      <input
        type="range"
        min={1}
        max={100}
        value={opacity}
        onChange={(e) => setOpacity(Number(e.target.value))}
      />
      <p>{opacity}%</p>
    </>
  );
};

export default OpacitySlider;
