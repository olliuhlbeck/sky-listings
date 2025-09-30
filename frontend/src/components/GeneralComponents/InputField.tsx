import { InputFieldProps } from '../../types/InputFieldProps';

const InputField = ({
  name,
  type,
  placeholder,
  value,
  onChange,
  className,
  autoComplete,
}: InputFieldProps) => {
  return (
    <input
      autoComplete={autoComplete}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`dark:bg-gray-50 text-center text-black p-2 border border-gray-300 rounded-md text-xs md:text-base lg:text-lg ${className}`}
    ></input>
  );
};

export default InputField;
