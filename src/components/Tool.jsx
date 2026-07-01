const Tool = ({ label, onClick, disabled, active }) => {
  return (
    <div className={`${active ? "aura duration-3000" : ""}`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`btn btn-active ${
          active ? "btn-primary" : ""
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {label}
      </button>
    </div>
  );
};

export default Tool;
