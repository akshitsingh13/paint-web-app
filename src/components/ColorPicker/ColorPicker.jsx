import "./ColorPicker.css";

const ColorPicker = ({ color, setColor }) => {
  return (
    <>
      <input
        className="color-picker"
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </>
  );
};

export default ColorPicker;
