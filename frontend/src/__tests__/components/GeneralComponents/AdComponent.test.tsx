import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdComponent from '../../../components/GeneralComponents/AdComponent';
import { FiStar } from 'react-icons/fi';

describe('AdComponent', () => {
  test('renders title and message', () => {
    render(
      <AdComponent
        icon={FiStar}
        title='Special Offer'
        message='Get 50% off today!'
        buttonText='Shop Now'
      />,
    );

    expect(screen.getByText(/special offer/i)).toBeInTheDocument();
    expect(screen.getByText(/get 50% off today!/i)).toBeInTheDocument();
  });

  test('renders icon component on both sides for md+ screens', () => {
    render(
      <AdComponent
        icon={FiStar}
        title='Limited Time'
        message='Offer ends soon'
        buttonText='Learn More'
      />,
    );

    const icons = screen.getByTestId('ad-component').querySelectorAll('svg');
    expect(icons).toHaveLength(2);
  });

  test('renders the call-to-action link with correct text', () => {
    render(
      <AdComponent
        icon={FiStar}
        title='Deal'
        message="Don't miss out"
        buttonText='Click Me'
      />,
    );

    const link = screen.getByRole('link', { name: /click me/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#');
  });

  test('calls onClick handler when CTA link is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <AdComponent
        icon={FiStar}
        title='Click Test'
        message='Testing click'
        buttonText='Click Me'
        onClick={handleClick}
      />,
    );

    const link = screen.getByRole('link', { name: /click me/i });
    await user.click(link);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom className from addToClassName prop', () => {
    render(
      <AdComponent
        icon={FiStar}
        title='Styled Ad'
        message='With extra styles'
        buttonText='Check It Out'
        addToClassName='extra-class'
      />,
    );

    const wrapper = screen.getByTestId('ad-component').closest('div');
    expect(wrapper).toHaveClass('extra-class');
  });
});
