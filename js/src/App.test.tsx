import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders footers', () => {
    const { getByText } = render(<App />);
    const footerElement = getByText(/RISELab/i);
    expect(footerElement).toBeInTheDocument();
});