const Tool = ({ label, onClick, disabled }) => {
  return (
    <>
      <button
        onClick={() => {
          onClick();
        }}
        className="p-2 border rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300"
        disabled={disabled}
      >
        {label}
      </button>
    </>
  );
};

export default Tool;
