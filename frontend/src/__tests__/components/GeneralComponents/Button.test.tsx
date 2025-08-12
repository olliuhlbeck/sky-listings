import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Button from '../../../components/GeneralComponents/Button';
import { FiFacebook } from 'react-icons/fi';

describe('Button component', () => {
  test('renders a <button> with text when no link is provided', () => {
    render(<Button text='Click Me' />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('renders a <Link> when link prop is provided', () => {
    render(
      <MemoryRouter>
        <Button text='Go to Page' link='/some-page' />
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: /go to page/i });
    expect(link).toHaveAttribute('href', '/some-page');
  });

  test('calls onClick when <button> is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button text='Click Me' onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /click me/i });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('calls onClick when <Link> is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <MemoryRouter>
        <Button text='Navigate' link='/next' onClick={handleClick} />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: /navigate/i });
    await user.click(link);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders icon if icon prop is passed', () => {
    render(<Button text='With Icon' icon={FiFacebook} />);
    const text = screen.getByText(/with icon/i);
    expect(text).toBeInTheDocument();
  });
});
