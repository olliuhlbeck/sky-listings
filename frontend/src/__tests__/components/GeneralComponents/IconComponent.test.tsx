import { render } from '@testing-library/react';
import { FaBeer } from 'react-icons/fa';
import IconComponent from '../../../components/GeneralComponents/IconComponent';

// Icon component
describe('IconComponent', () => {
  it('renders the passed icon as svg', () => {
    const { container } = render(<IconComponent icon={FaBeer} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies default size when no size is provided', () => {
    const { container } = render(<IconComponent icon={FaBeer} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('width', '24');
  });

  it('applies the given size', () => {
    const { container } = render(<IconComponent icon={FaBeer} size={48} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '48');
    expect(svg).toHaveAttribute('width', '48');
  });

  it('adds the given added className', () => {
    const { container } = render(
      <IconComponent icon={FaBeer} className='test-class' />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('test-class');
  });
});
