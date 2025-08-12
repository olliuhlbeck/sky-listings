import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContentButtonCard from '../../../components/GeneralComponents/ContentButtonCard';

const backgroundImage = 'test-image.jpg';

// Content button card
describe('ContentButtonCard', () => {
  test('renders button text', () => {
    render(
      <MemoryRouter>
        <ContentButtonCard
          buttonText='Click me'
          backgroundImage={backgroundImage}
          link='/test-link'
        />
      </MemoryRouter>,
    );

    expect(screen.getByText(/click me/i)).toBeInTheDocument();
  });

  test('applies background image style', () => {
    render(
      <MemoryRouter>
        <ContentButtonCard
          buttonText='Test'
          backgroundImage={backgroundImage}
          link='/test-link'
        />
      </MemoryRouter>,
    );

    const div = screen.getByText(/test/i).parentElement?.parentElement;
    expect(div).toHaveStyle(`background-image: url(${backgroundImage})`);
  });

  test('renders card wrapped in <Link> when link prop is provided', () => {
    render(
      <MemoryRouter>
        <ContentButtonCard
          buttonText='Link Test'
          backgroundImage={backgroundImage}
          link='/some-path'
        />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/some-path');
  });

  test('applies additional className to Button component', () => {
    const extraClass = 'extra-class';

    render(
      <MemoryRouter>
        <ContentButtonCard
          buttonText='Styled Button'
          backgroundImage={backgroundImage}
          addToClassName={extraClass}
          link='/styled-link'
        />
      </MemoryRouter>,
    );

    const buttonTextElement = screen.getByText(/styled button/i);
    const button = buttonTextElement.closest('a,button');
    expect(button).toHaveClass(extraClass);
  });
});
