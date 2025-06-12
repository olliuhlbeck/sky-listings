import { useState } from 'react';
import IconComponent from '../GeneralComponents/IconComponent';
import { FaRegEdit } from 'react-icons/fa';
import { EditableFieldProps } from '../../types/EditableFieldProps';

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  field,
  onEdit,
  options,
}) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value?.toString() || '');

  const handleBlur = () => {
    setEditing(false);
    if (inputValue !== value?.toString()) {
      onEdit(field, inputValue);
    }
  };

  return (
    <div className='flex gap-4 items-center'>
      <strong>{label}</strong>
      {editing ? (
        options ? (
          <select
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className='border px-2 py-1 rounded'
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleBlur();
              }
            }}
            className='border px-2 py-1 rounded'
            autoFocus
          />
        )
      ) : (
        <>
          <span>{value || 'N/A'}</span>
          <button onClick={() => setEditing(true)} title={`Edit ${label}`}>
            <IconComponent
              icon={FaRegEdit}
              size={20}
              className='hover:cursor-pointer rounded-md'
            />
          </button>
        </>
      )}
    </div>
  );
};

export default EditableField;
