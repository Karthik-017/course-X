import FormInput from "./FormInput";

const AuthForm = ({
  title,
  fields,
  onChange,
  onSubmit,
  message,
  buttonLabel,
}) => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field) => (
          <FormInput
            key={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={field.value}
            onChange={onChange}
          />
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          {buttonLabel}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default AuthForm;
