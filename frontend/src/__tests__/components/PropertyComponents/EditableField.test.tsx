import userEvent from '@testing-library/user-event';
import EditableField from '../../../components/PropertyComponents/EditableField';
import { EditableFieldProps } from '../../../types/EditableFieldProps';
import { render, screen } from '@testing-library/react';

// Render helper function
const renderEditableField = (props: Partial<EditableFieldProps> = {}) => {
  const defaultProps: EditableFieldProps = {
    label: 'Test Label',
    field: 'street',
    value: 'Test Value',
    onEdit: jest.fn(),
    isEdited: false,
    ...props,
  };

  return render(<EditableField {...defaultProps} />);
};

describe('EditableField Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the label correctly', () => {
    renderEditableField({ label: 'Street Address' });
    expect(screen.getByText('Street Address')).toBeInTheDocument();
  });

  it('displays the value when not editing', () => {
    renderEditableField({ value: '123 Main St' });
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('displays "N/A" when value is null or undefined', () => {
    renderEditableField({ value: null });
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders edit button with correct title', () => {
    renderEditableField({ label: 'City' });
    const editButton = screen.getByRole('button', { name: 'Edit City' });
    expect(editButton).toBeInTheDocument();
  });

  it('switches to edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderEditableField({ value: 'Original Value' });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Original Value');
    expect(input).toHaveFocus();
  });

  it('saves changes when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    renderEditableField({ value: 'Original', onEdit, field: 'street' });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Updated Value{Enter}');

    expect(onEdit).toHaveBeenCalledWith('street', 'Updated Value');
  });

  it('cancels editing when Escape key is pressed without saving', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    renderEditableField({ value: 'Original', onEdit });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'New Value{Escape}');

    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Original')).toBeInTheDocument();
  });

  it('calls onEdit with trimmed value when input loses focus', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    renderEditableField({ value: 'Original', onEdit, field: 'city' });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '  New Value  ');
    await user.tab();

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith('city', 'New Value');
  });

  it('does not call onEdit when value has not changed', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    renderEditableField({ value: 'Same Value', onEdit });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    await user.tab();

    expect(onEdit).not.toHaveBeenCalled();
  });

  it('trims whitespace from input value before saving', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    renderEditableField({ value: 'Test', onEdit, field: 'description' });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '   Trimmed   ');
    await user.tab();

    expect(onEdit).toHaveBeenCalledWith('description', 'Trimmed');
  });

  it('handles empty string value', () => {
    renderEditableField({ value: '' });
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('handles numeric values correctly', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    renderEditableField({ value: 42, onEdit, field: 'price' });

    expect(screen.getByText('42')).toBeInTheDocument();

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('42');
  });

  it('handles Escape key in select dropdown', async () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const user = userEvent.setup();
    const onEdit = jest.fn();
    renderEditableField({ value: 'Option 1', options, onEdit });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Option 2');
    await user.keyboard('{Escape}');

    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('handles Enter key in select dropdown', async () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const user = userEvent.setup();
    const onEdit = jest.fn();
    renderEditableField({
      value: 'Option 1',
      options,
      onEdit,
      field: 'propertyStatus',
    });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Option 3');
    await user.keyboard('{Enter}');

    expect(onEdit).toHaveBeenCalledWith('propertyStatus', 'Option 3');
  });

  it('calls onEdit when select value changes and loses focus', async () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const user = userEvent.setup();
    const onEdit = jest.fn();
    renderEditableField({
      value: 'Option 1',
      options,
      onEdit,
      field: 'propertyType',
    });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Option 2');
    await user.tab();

    expect(onEdit).toHaveBeenCalledWith('propertyType', 'Option 2');
  });

  it('renders a select dropdown when options are provided', async () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const user = userEvent.setup();
    renderEditableField({ value: 'Option 1', options });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('Option 1');
  });

  it('renders all options in the dropdown', async () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const user = userEvent.setup();
    renderEditableField({ value: 'Option 1', options });

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    options.forEach((option) => {
      expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
    });
  });
});
