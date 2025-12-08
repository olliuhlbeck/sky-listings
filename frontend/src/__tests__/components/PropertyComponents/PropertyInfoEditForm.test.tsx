import userEvent from '@testing-library/user-event';
import PropertyInfoEditForm from '../../../components/PropertyComponents/PropertyInfoEditForm';
import { UserProperty } from '../../../types/dtos/GetUsersPropertiesByUserIdResponse.dto';
import { PropertyEditProps } from '../../../types/PropertyEditProps';
import * as useAuthModule from '../../../utils/useAuth';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';

// Mock useAuth hook
jest.mock('../../../utils/useAuth');

// Mock fetch
global.fetch = jest.fn();

// Sample property data
const mockProperty: UserProperty = {
  id: 1,
  userId: 1,
  street: '123 Main St',
  city: 'Test City',
  state: 'Test State',
  country: 'Test Country',
  postalCode: '12345',
  price: 250000,
  bedrooms: 3,
  bathrooms: 2,
  squareMeters: 150,
  propertyType: 'House',
  propertyStatus: 'For Sale',
  description: 'A beautiful property',
  additionalInfo: 'Near schools',
  createdAt: new Date('2024-01-01'),
};

// Render helper function
const renderPropertyInfoEditForm = (props: Partial<PropertyEditProps> = {}) => {
  const defaultProps: PropertyEditProps = {
    property: mockProperty,
    originalProperty: mockProperty,
    onPropertyUpdate: jest.fn(),
    ...props,
  };

  return render(<PropertyInfoEditForm {...defaultProps} />);
};

describe('PropertyInfoEditForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({
      token: 'mock-token',
    });
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the form with header', () => {
    renderPropertyInfoEditForm();
    expect(screen.getByText('Edit Property')).toBeInTheDocument();
  });

  it('renders all editable fields with correct labels', () => {
    renderPropertyInfoEditForm();

    expect(screen.getByText('Street:')).toBeInTheDocument();
    expect(screen.getByText('City:')).toBeInTheDocument();
    expect(screen.getByText('State:')).toBeInTheDocument();
    expect(screen.getByText('Country:')).toBeInTheDocument();
    expect(screen.getByText('Postal Code:')).toBeInTheDocument();
    expect(screen.getByText('Price:')).toBeInTheDocument();
    expect(screen.getByText('Bedrooms:')).toBeInTheDocument();
    expect(screen.getByText('Bathrooms:')).toBeInTheDocument();
    expect(screen.getByText('Square Meters:')).toBeInTheDocument();
    expect(screen.getByText('Type:')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Additional Info:')).toBeInTheDocument();
  });

  it('displays property values correctly', () => {
    renderPropertyInfoEditForm();

    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Test City')).toBeInTheDocument();
    expect(screen.getByText('250000')).toBeInTheDocument();
  });

  it('submit button is disabled when no fields are edited', () => {
    renderPropertyInfoEditForm();
    const submitButton = screen.getByRole('button', { name: 'Save changes' });
    expect(submitButton).toBeDisabled();
  });

  it('submit button is enabled after editing a field', async () => {
    const user = userEvent.setup();
    renderPropertyInfoEditForm();

    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '456 New St{Enter}');

    const submitButton = screen.getByRole('button', { name: 'Save changes' });
    expect(submitButton).toBeEnabled();
  });

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup();
    renderPropertyInfoEditForm();

    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '456 New St{Enter}');

    const resetButton = screen.getByRole('button', { name: '' });
    await user.click(resetButton);

    const submitButton = screen.getByRole('button', { name: 'Save changes' });
    expect(submitButton).toBeDisabled();
  });

  it('successfully submits edited fields and shows success message', async () => {
    const user = userEvent.setup();
    const onPropertyUpdate = jest.fn();
    const updatedProperty = { ...mockProperty, street: '456 New St' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ updatedProperty }),
    });

    renderPropertyInfoEditForm({ onPropertyUpdate });

    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '456 New St{Enter}');

    const submitButton = screen.getByRole('button', { name: 'Save changes' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Property updated successfully!'),
      ).toBeInTheDocument();
    });

    expect(onPropertyUpdate).toHaveBeenCalledWith(updatedProperty);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/property/editPropertyInformation/1',
      expect.objectContaining({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
      }),
    );
  });

  it('shows error message when submission fails', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    renderPropertyInfoEditForm();

    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '456 New St{Enter}');

    const submitButton = screen.getByRole('button', { name: 'Save changes' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error updating property.')).toBeInTheDocument();
    });
  });

  it('clears previous messages when property changes', () => {
    const { rerender } = renderPropertyInfoEditForm();

    const newProperty = { ...mockProperty, id: 2, street: '789 Other St' };
    rerender(
      <PropertyInfoEditForm
        property={newProperty}
        originalProperty={newProperty}
        onPropertyUpdate={jest.fn()}
      />,
    );

    expect(
      screen.queryByText('Property updated successfully!'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Error updating property.'),
    ).not.toBeInTheDocument();
  });

  it('does not call onPropertyUpdate on failed update', async () => {
    const user = userEvent.setup();
    const onPropertyUpdate = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    renderPropertyInfoEditForm({ onPropertyUpdate });

    const editBtn = screen.getAllByRole('button', { name: /edit/i })[0];
    await user.click(editBtn);

    const input = screen.getByRole('textbox');
    await user.type(input, 'New Street{Enter}');

    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(screen.getByText('Error updating property.')).toBeInTheDocument();
    });

    expect(onPropertyUpdate).not.toHaveBeenCalled();
  });

  it('removes success message after timeout', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ updatedProperty: mockProperty }),
    });

    renderPropertyInfoEditForm();

    const editBtn = screen.getAllByRole('button', { name: /edit/i })[0];
    await user.click(editBtn);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'New Street{Enter}');

    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(
        screen.getByText('Property updated successfully!'),
      ).toBeInTheDocument();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(
      screen.queryByText('Property updated successfully!'),
    ).not.toBeInTheDocument();
  });
});
