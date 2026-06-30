const Tool = ({ label, onClick, disabled, active }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-active ${
        active ? "btn-primary" : ""
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
};

export default Tool;
