import { render, screen, fireEvent } from '@testing-library/react';
import EditUserData from 'components/EditUserData'; // Zorg dat dit verwijst naar het hoofdproject
import { BrowserRouter } from 'react-router-dom';

test('toont foutmelding bij ongeldig telefoonnummer', () => {
    render(
        <BrowserRouter>
            <EditUserData />
        </BrowserRouter>
    );

    const phoneInput = screen.getByLabelText(/telefoonnummer/i);
    fireEvent.change(phoneInput, { target: { value: '12345678' } });

    const submitButton = screen.getByText(/gegevens opslaan/i);
    fireEvent.click(submitButton);

    const errorMessage = screen.getByText(/telefoonnummer moet tussen 10 en 15 cijfers zijn/i);
    expect(errorMessage).toBeInTheDocument();
});
