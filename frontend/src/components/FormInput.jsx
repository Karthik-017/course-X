const FormInput = ({ name, type = "text", placeholder, onChange, value }) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
      required
    />
  );
};

export default FormInput;
