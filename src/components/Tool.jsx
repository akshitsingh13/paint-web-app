const Tool = ({ label, onClick, disabled, active }) => {
  return (
    <div className={`${active ? "aura" : ""} shrink-0`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`btn btn-active btn-sm sm:btn-md ${
          active ? "btn-primary" : ""
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {label}
      </button>
    </div>
  );
};

export default Tool;
