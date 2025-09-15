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

  // Handle pressing escape or enter during edit
  const handleKeyDownOnEdit = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (event.key === 'Enter') {
      handleBlur();
    } else if (event.key === 'Escape') {
      setInputValue(value?.toString() || '');
      setEditing(false);
    }
  };

  // Handle edit field losing focus
  const handleBlur = (): void => {
    setEditing(false);
    const trimmedValue = inputValue.trim();
    if (trimmedValue !== value?.toString()) {
      onEdit(field, trimmedValue);
    }
  };

  return (
    <div className='flex gap-4 items-center'>
      <strong className='text-left w-40'>{label}</strong>
      {editing ? (
        options ? (
          <select
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDownOnEdit}
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
            onChange={(event) => setInputValue(event.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDownOnEdit}
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
