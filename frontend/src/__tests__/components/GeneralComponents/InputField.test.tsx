import { render, screen, fireEvent } from '@testing-library/react';
import InputField from '../../../components/GeneralComponents/InputField';

// Input field
describe('InputField', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with given props', () => {
    render(
      <InputField
        name='username'
        type='text'
        placeholder='Enter your name'
        value='John'
        onChange={mockOnChange}
        className='custom-class'
      />,
    );

    const input = screen.getByPlaceholderText(
      'Enter your name',
    ) as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.name).toBe('username');
    expect(input.type).toBe('text');
    expect(input.value).toBe('John');
    expect(input).toHaveClass('custom-class');
    expect(input).toHaveClass('text-center', 'text-black');
  });

  it('calls onChange when typing', () => {
    render(
      <InputField
        name='username'
        type='text'
        placeholder='Type here'
        value=''
        onChange={mockOnChange}
        className=''
      />,
    );

    const input = screen.getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'Alice' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });
});
