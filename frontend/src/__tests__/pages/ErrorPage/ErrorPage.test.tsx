import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorPage from '../../../pages/ErrorPage/ErrorPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ErrorPage', () => {
  it('renders without crashing', () => {
    renderWithRouter(<ErrorPage />);
    expect(
      screen.getByRole('heading', { name: 'Something Went Wrong' }),
    ).toBeInTheDocument();
  });

  it('displays 404-specific message when errorCode is 404', () => {
    renderWithRouter(<ErrorPage errorCode={404} />);
    expect(screen.getByText(/Error 404: Page not found./i)).toBeInTheDocument();
    expect(screen.getByText(/Please check provided url/i)).toBeInTheDocument();
  });

  it('displays generic error message for non-404 errors', () => {
    renderWithRouter(<ErrorPage errorCode={500} />);
    expect(screen.queryByText(/error code 404/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/page not found/i)).not.toBeInTheDocument();
    const errorMessages = screen.getAllByText(
      /we encountered an unexpected error/i,
    );
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('renders the home page button with correct text', () => {
    renderWithRouter(<ErrorPage errorCode={404} />);
    expect(screen.getByText(/go back to home page/i)).toBeInTheDocument();
  });

  it('home button links to home page', () => {
    renderWithRouter(<ErrorPage errorCode={404} />);
    const link = screen.getByRole('link', { name: /go back to home page/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
