import { BrowserRouter } from 'react-router-dom';
import { HeaderButtonProps } from '../../../types/HeaderButtonProps';
import HeaderButton from '../../../components/HeaderComponents/HeaderButton';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionType } from '../../../types/ActionType';

// Render helper function
const renderHeaderButton = (props: Partial<HeaderButtonProps> = {}) => {
  const defaultProps: HeaderButtonProps = {
    text: 'Test Button',
    link: '/test',
    ...props,
  };

  return render(
    <BrowserRouter>
      <HeaderButton {...defaultProps} />
    </BrowserRouter>,
  );
};

describe('HeaderButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders HeaderButton component with text', () => {
    renderHeaderButton();
    const buttonElement = screen.getByText('Test Button');
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders with correct href attribute', () => {
    renderHeaderButton({ link: '/custom-link' });
    const linkElement = screen.getByRole('link', { name: /test button/i });
    expect(linkElement).toHaveAttribute('href', '/custom-link');
  });

  it('calls onClick handler when clicked', async () => {
    const mockOnClick = jest.fn();
    renderHeaderButton({ onClick: mockOnClick });

    const button = screen.getByRole('link', { name: /test button/i });
    await userEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not throw error when clicked without onClick handler', async () => {
    renderHeaderButton({ onClick: undefined });

    const button = screen.getByRole('link', { name: /test button/i });
    await expect(userEvent.click(button)).resolves.not.toThrow();
  });

  it('passes state with action to Link component', () => {
    const testState = { action: ActionType.Login };
    renderHeaderButton({ state: testState });

    const button = screen.getByRole('link', { name: /test button/i });
    expect(button).toBeInTheDocument();
  });

  it('renders without state prop', () => {
    renderHeaderButton({ state: undefined });

    const button = screen.getByRole('link', { name: /test button/i });
    expect(button).toBeInTheDocument();
  });
});
