import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../../components/LoginComponents/LoginForm';
import { ActionType } from '../../../types/ActionType';
import * as useAuthModule from '../../../utils/useAuth';
import userEvent from '@testing-library/user-event';

// Mock the useAuth hook
jest.mock('../../../utils/useAuth');

// Mock fetch
global.fetch = jest.fn();

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Render helper function
const renderForm = (action: ActionType) =>
  render(
    <BrowserRouter>
      <LoginForm action={action} setAction={mockSetAction} />
    </BrowserRouter>,
  );

// Helper to get form fields
const getFields = () => ({
  first: screen.queryByPlaceholderText('First Name'),
  last: screen.queryByPlaceholderText('Last Name'),
  email: screen.queryByPlaceholderText('Email'),
  username: screen.getByPlaceholderText('Username'),
  password: screen.getByPlaceholderText('Password'),
});

// Mock functions
const mockSetAction = jest.fn();
const mockLogin = jest.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  it('renders login form fields', () => {
    renderForm(ActionType.Login);

    const { username, password } = getFields();

    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders login form fields', () => {
    renderForm(ActionType.Login);

    const { username, password } = getFields();

    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders signup form fields', () => {
    renderForm(ActionType.SignUp);

    const { first, last, email, username, password } = getFields();

    expect(first).toBeInTheDocument();
    expect(last).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('shows validation errors on invalid login', async () => {
    const user = userEvent.setup();
    renderForm(ActionType.Login);

    const { username, password } = getFields();

    await user.type(username, 'a');
    await user.type(password, '123');

    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() =>
      expect(screen.getByText('Min. length 6 characters.')).toBeInTheDocument(),
    );
  });

  it('shows email validation error on invalid signup email', async () => {
    const user = userEvent.setup();
    renderForm(ActionType.SignUp);

    const { first, last, email, username, password } = getFields();

    await user.type(first!, 'John');
    await user.type(last!, 'Doe');
    await user.type(email!, 'invalid-email');
    await user.type(username, 'testuser');
    await user.type(password, 'password123');

    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() =>
      expect(
        screen.getByText('Please enter a valid email.'),
      ).toBeInTheDocument(),
    );
  });

  it('does not render signup-only fields in login mode', () => {
    renderForm(ActionType.Login);

    const { first, last, email } = getFields();

    expect(first).not.toBeInTheDocument();
    expect(last).not.toBeInTheDocument();
    expect(email).not.toBeInTheDocument();
  });

  it('displays server error when login fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage }),
    });

    renderForm(ActionType.Login);

    const { username, password } = getFields();
    await user.type(username, 'testuser');
    await user.type(password, 'wrongpass');

    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('successfully logs in with valid credentials', async () => {
    const user = userEvent.setup();
    const mockToken = 'mock-jwt-token';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken }),
    });

    renderForm(ActionType.Login);

    const { username, password } = getFields();
    await user.type(username, 'testuser');
    await user.type(password, 'password123');

    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockToken);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    expect(username).toHaveValue('');
    expect(password).toHaveValue('');
  });

  it('successfully signs up with valid data', async () => {
    const user = userEvent.setup();
    const mockToken = 'mock-jwt-token';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken }),
    });

    renderForm(ActionType.SignUp);

    const { first, last, email, username, password } = getFields();
    await user.type(first!, 'John');
    await user.type(last!, 'Doe');
    await user.type(email!, 'john@example.com');
    await user.type(username, 'johndoe');
    await user.type(password, 'password123');

    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockToken);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    expect(first).toHaveValue('');
    expect(last).toHaveValue('');
    expect(email).toHaveValue('');
    expect(username).toHaveValue('');
    expect(password).toHaveValue('');
  });

  it('switches between login and signup modes', async () => {
    const user = userEvent.setup();
    renderForm(ActionType.Login);

    const switchButton = screen.getByText('Create one by clicking here');
    await user.click(switchButton);

    expect(mockSetAction).toHaveBeenCalledWith(ActionType.SignUp);
  });

  it('clears general errors when typing again after receiving error message', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    renderForm(ActionType.Login);

    const { username, password } = getFields();

    await user.type(username, 'test');
    await user.type(password, 'pass123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() =>
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument(),
    );

    await user.type(username, 'x');

    await waitFor(() =>
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument(),
    );
  });

  it('shows password error when too short', async () => {
    const user = userEvent.setup();
    renderForm(ActionType.Login);

    const { username, password } = getFields();
    await user.type(username, 'validuser');
    await user.type(password, '123');

    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() =>
      expect(screen.getByText('Min. length 6 characters.')).toBeInTheDocument(),
    );
  });

  it('accepts password with exactly 6 characters', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'token' }),
    });

    renderForm(ActionType.Login);

    const { username, password } = getFields();
    await user.type(username, 'testuser');
    await user.type(password, '123456');

    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    expect(
      screen.queryByText('Min. length 6 characters.'),
    ).not.toBeInTheDocument();
  });

  it('accepts password with exactly 6 characters', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'token' }),
    });

    renderForm(ActionType.Login);

    const { username, password } = getFields();
    await user.type(username, 'testuser');
    await user.type(password, '123456');

    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    expect(
      screen.queryByText('Min. length 6 characters.'),
    ).not.toBeInTheDocument();
  });

  it('shows email validation error on invalid email', async () => {
    const user = userEvent.setup();
    renderForm(ActionType.SignUp);

    const { first, last, email, username, password } = getFields();
    await user.type(first!, 'John');
    await user.type(last!, 'Doe');
    await user.type(email!, 'invalid-email');
    await user.type(username, 'testuser');
    await user.type(password, 'password123');

    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() =>
      expect(
        screen.getByText('Please enter a valid email.'),
      ).toBeInTheDocument(),
    );
  });

  it('validates email with missing domain', async () => {
    const user = userEvent.setup();
    renderForm(ActionType.SignUp);

    const { first, last, email, username, password } = getFields();
    await user.type(first!, 'John');
    await user.type(last!, 'Doe');
    await user.type(email!, 'test@');
    await user.type(username, 'testuser');
    await user.type(password, 'password123');

    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() =>
      expect(
        screen.getByText('Please enter a valid email.'),
      ).toBeInTheDocument(),
    );
  });

  it('accepts valid email formats', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'token' }),
    });

    renderForm(ActionType.SignUp);

    const { first, last, email, username, password } = getFields();
    await user.type(first!, 'John');
    await user.type(last!, 'Doe');
    await user.type(email!, 'test.user+tag@example.co.uk');
    await user.type(username, 'testuser');
    await user.type(password, 'password123');

    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    expect(
      screen.queryByText('Please enter a valid email.'),
    ).not.toBeInTheDocument();
  });

  it('has proper form label', () => {
    renderForm(ActionType.Login);

    const form = screen.getByRole('form', { name: 'Login Form' });
    expect(form).toBeInTheDocument();
  });

  it('has proper form label in signup mode', () => {
    renderForm(ActionType.SignUp);

    const form = screen.getByRole('form', { name: 'Sign Up Form' });
    expect(form).toBeInTheDocument();
  });

  it('has screen reader labels for all inputs', () => {
    renderForm(ActionType.SignUp);

    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('accepts special characters in password', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'token' }),
    });

    renderForm(ActionType.Login);

    const { username, password } = getFields();
    await user.type(username, 'testuser');
    await user.type(password, 'p@ssw0rd!#$');

    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
