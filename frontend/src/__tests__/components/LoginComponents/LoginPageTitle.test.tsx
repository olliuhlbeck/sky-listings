import { render, screen } from '@testing-library/react';
import LoginPageTitle from '../../../components/LoginComponents/LoginPageTitle';
import { ActionType } from '../../../types/ActionType';
import { LoginComponentProps } from '../../../types/LoginComponentProps';

// Render helper function
const renderLoginPageTitle = (action: ActionType) => {
  const props: LoginComponentProps = {
    action,
    setAction: jest.fn(),
  };

  return render(<LoginPageTitle {...props} />);
};

describe('LoginPageTitle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Login title when action is Login', () => {
    renderLoginPageTitle(ActionType.Login);

    const title = screen.getAllByRole('heading', { name: 'Login' });
    expect(title).toHaveLength(1);
  });

  it('renders Login heading as h1 element', () => {
    renderLoginPageTitle(ActionType.Login);

    const heading = screen.getAllByRole('heading', {
      level: 1,
      name: 'Login',
    });
    expect(heading).toHaveLength(1);
  });

  it('renders "Sign up" title when action is SignUp', () => {
    renderLoginPageTitle(ActionType.SignUp);

    const title = screen.getAllByRole('heading', { name: 'Sign up' });
    expect(title).toHaveLength(1);
  });

  it('renders Sign up heading as h1 element', () => {
    renderLoginPageTitle(ActionType.SignUp);

    const heading = screen.getAllByRole('heading', {
      level: 1,
      name: 'Sign up',
    });
    expect(heading).toHaveLength(1);
  });

  it('desktop container is hidden from screen readers', () => {
    const { container } = renderLoginPageTitle(ActionType.Login);

    const desktopContainer = container.querySelector('[aria-hidden="true"]');
    expect(desktopContainer).toBeInTheDocument();
  });
});
