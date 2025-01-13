/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditUserData from '../src/pages/EditUserData';
import { BrowserRouter } from 'react-router-dom';


test('toont foutmelding bij ongeldig telefoonnummer', () => {
    render(
        <BrowserRouter>
            <EditUserData />
        </BrowserRouter>
    );

    const input = screen.getByLabelText(/telefoonnummer/i);
    fireEvent.change(input, { target: { value: '12345678' } });

    const submitButton = screen.getByText(/gegevens opslaan/i);
    fireEvent.click(submitButton);

    const errorMessage = screen.getByText(/telefoonnummer moet tussen 10 en 15 cijfers zijn/i);
    expect(errorMessage).toBeInTheDocument();
});


test('toont foutmelding bij geen adres maar wel plaatsnaam', () => {
    render(
        <BrowserRouter>
            <EditUserData />
        </BrowserRouter>
    );

    const input = screen.getByLabelText(/plaats/i);
    fireEvent.change(input, { target: { value: 'testplaats' } });

    const submitButton = screen.getByText(/gegevens opslaan/i);
    fireEvent.click(submitButton);

    const errorMessage = screen.getByText(/Adres is verplicht als plaatsnaam is ingevoerd/i);
    expect(errorMessage).toBeInTheDocument();
});

test('toont foutmelding bij ongeldige naam', () => {
    render(
        <BrowserRouter>
            <EditUserData />
        </BrowserRouter>
    );
    const input = screen.getByLabelText(/voornaam/i);
    fireEvent.change(input, { target: { value: '' } });
    const submitButton = screen.getByText(/gegevens opslaan/i);
    fireEvent.click(submitButton);
    const errorMessage = screen.getByText(/Voornaam is verplicht/i);
    expect(errorMessage).toBeInTheDocument();
});