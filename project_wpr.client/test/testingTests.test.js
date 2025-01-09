
 //test om te testen of de testing environment goed is 

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';


test('renders a simple component', () => {
	render(<div>Hello, World!</div>);
	expect(screen.getByText(/hello, world!/i)).toBeInTheDocument();
});
