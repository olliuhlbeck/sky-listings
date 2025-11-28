import { render, screen } from '@testing-library/react';
import Footer from '../../../components/FooterComponents/Footer';
import userEvent from '@testing-library/user-event';

// Render helper function
const mockSetFooterVisible = jest.fn();
const renderFooter = (footerVisible: boolean = true) => {
  return render(
    <Footer
      footerVisible={footerVisible}
      setFooterVisible={mockSetFooterVisible}
    />,
  );
};

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Footer component', () => {
    renderFooter();
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  it('displays all content when footerVisible is true', () => {
    renderFooter();

    expect(screen.getByText('TS & Tailwind')).toBeInTheDocument();
    expect(screen.getByText('Quick links')).toBeInTheDocument();
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('References')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(
      screen.getByText('© 2025 My coding pracs. All rights reserved.'),
    ).toBeInTheDocument();
  });

  it('hides content when footer is not visible', () => {
    renderFooter(false);

    expect(screen.queryByText('TS & Tailwind')).not.toBeInTheDocument();
    expect(screen.queryByText('Quick links')).not.toBeInTheDocument();
    expect(screen.queryByText('Contacts')).not.toBeInTheDocument();
  });

  it('calls setFooterVisible with false when toggle button clicked and footer visible', async () => {
    renderFooter(true);

    const button = screen.getByRole('button', { name: /toggle footer/i });
    await userEvent.click(button);

    expect(mockSetFooterVisible).toHaveBeenCalledTimes(1);
    expect(mockSetFooterVisible).toHaveBeenCalledWith(false);
  });

  it('calls setFooterVisible with true when toggle button clicked and footer hidden', async () => {
    renderFooter(false);

    const button = screen.getByRole('button', { name: /toggle footer/i });
    await userEvent.click(button);

    expect(mockSetFooterVisible).toHaveBeenCalledTimes(1);
    expect(mockSetFooterVisible).toHaveBeenCalledWith(true);
  });

  it('renders phone link with correct href', () => {
    renderFooter();

    const phoneLink = screen.getByRole('link', {
      name: /Call \+358 40 511 3313/i,
    });
    expect(phoneLink).toHaveAttribute('href', 'tel:+358405113313');
  });

  it('renders email link with correct href', () => {
    renderFooter();

    const emailLink = screen.getByRole('link', {
      name: /Send email to olli.uhlbeck@gmail.com/i,
    });
    expect(emailLink).toHaveAttribute('href', 'mailto:olli.uhlbeck@gmail.com');
  });

  it('renders phone link with accessible label', () => {
    renderFooter();

    const phoneLink = screen.getByLabelText('Call +358 40 511 3313');
    expect(phoneLink).toBeInTheDocument();
  });

  it('renders email link with accessible label', () => {
    renderFooter();

    const emailLink = screen.getByLabelText(
      'Send email to olli.uhlbeck@gmail.com',
    );
    expect(emailLink).toBeInTheDocument();
  });
});
