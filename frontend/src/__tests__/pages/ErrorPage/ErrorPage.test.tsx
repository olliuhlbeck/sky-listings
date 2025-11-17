import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorPage from '../../../pages/ErrorPage/ErrorPage';

// Wrapper for components that use routing
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ErrorPage', () => {
  it('renders without crashing', () => {
    renderWithRouter(<ErrorPage errorCode={404} />);
    expect(
      screen.getByText(/we have encountered an error/i),
    ).toBeInTheDocument();
  });

  it('displays 404-specific message when errorCode is 404', () => {
    renderWithRouter(<ErrorPage errorCode={404} />);
    expect(screen.getByText(/error code 404/i)).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByText(/please check provided url/i)).toBeInTheDocument();
  });

  it('displays generic error message for non-404 errors', () => {
    renderWithRouter(<ErrorPage errorCode={500} />);
    expect(screen.queryByText(/error code 404/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/page not found/i)).not.toBeInTheDocument();
    const errorMessages = screen.getAllByText(/we have encountered an error/i);
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('renders the home page button with correct text', () => {
    renderWithRouter(<ErrorPage errorCode={404} />);
    expect(screen.getByText(/go back to home page/i)).toBeInTheDocument();
  });

  it('renders error icons', () => {
    renderWithRouter(<ErrorPage errorCode={404} />);
    const icons = screen.getAllByTestId('icon-component');
    expect(icons).toHaveLength(2);
  });
});
