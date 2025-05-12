import { InputFieldProps } from '../../types/InputFieldProps';

const InputField = ({
  name,
  type,
  placeholder,
  value,
  onChange,
  className,
}: InputFieldProps) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`text-center text-black p-2 border border-gray-300 rounded-md ${className}`}
    ></input>
  );
};

export default InputField;
