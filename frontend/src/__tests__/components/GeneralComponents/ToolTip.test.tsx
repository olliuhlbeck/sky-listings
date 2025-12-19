import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToolTip from '../../../components/GeneralComponents/ToolTip';

describe('ToolTip component', () => {
  it('renders children correctly', () => {
    render(
      <ToolTip toolTipText='Tooltip text'>
        <button>Hover me</button>
      </ToolTip>,
    );
    // Child element should always be in the document since there is no tooltip if there is no children
    expect(
      screen.getByRole('button', { name: /hover me/i }),
    ).toBeInTheDocument();
  });

  it('tooltip text is in the document but hidden by default', () => {
    render(
      <ToolTip toolTipText='Tooltip text'>
        <button>Hover me</button>
      </ToolTip>,
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass('scale-0');
  });

  it('shows tooltip text on hover and hide on unhover', async () => {
    const user = userEvent.setup();
    render(
      <ToolTip toolTipText='Tooltip text'>
        <button>Hover me</button>
      </ToolTip>,
    );
    const tooltip = screen.getByRole('tooltip');
    const trigger = screen.getByRole('button', { name: /hover me/i });

    // Tooltip hidden initially
    expect(tooltip).toHaveClass('scale-0');
    // Hover over the child element
    await user.hover(trigger);
    // Tooltip should become visible
    expect(tooltip).toHaveClass('group-hover:scale-100');
    // Unhover the child element
    await user.unhover(trigger);
    expect(tooltip).toHaveClass('scale-0');
  });

  it('applies additional class names from addToClassName prop', () => {
    render(
      <ToolTip toolTipText='Tooltip text' addToClassName='extra-class'>
        <button>Hover me</button>
      </ToolTip>,
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('extra-class');
  });
});
