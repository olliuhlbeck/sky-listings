import { render, screen } from '@testing-library/react';
import BrowsePropertiesPage from '../../../pages/BrowsePropertiesPage/BrowsePropertiesPage';

describe('BrowsePropertiesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Ensures main container div is rendered correctly
  it('renders main container', () => {
    render(<BrowsePropertiesPage />);
    const mainDiv = screen.getByTestId('browse-properties-page-main-container');
    expect(mainDiv).toBeInTheDocument();
  });
});
