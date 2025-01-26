/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AddVehicle from '../src/pages/AddVehicle';

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Voertuig succesvol toegevoegd' }),
    })
);

test('voegt succesvol een voertuig toe', async () => {
    render(
        <Router>
            <AddVehicle />
        </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Kenteken'), { target: { value: 'AB-123-CD' } });
    fireEvent.change(screen.getByPlaceholderText('Merk'), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByPlaceholderText('Model'), { target: { value: 'Corolla' } });
    fireEvent.change(screen.getByPlaceholderText('Kleur'), { target: { value: 'Blauw' } });
    fireEvent.change(screen.getByPlaceholderText('Aankoopjaar'), { target: { value: '2020' } });
    fireEvent.change(screen.getByPlaceholderText('Beschrijving'), { target: { value: 'Een betrouwbare auto' } });
    fireEvent.change(screen.getByPlaceholderText('Huurprijs'), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText('Soort voertuig:'), { target: { value: 'car' } });
    fireEvent.change(screen.getByPlaceholderText('Versnellingsbak'), { target: { value: 'Automaat' } });
    fireEvent.change(screen.getByLabelText('Beschikbaarheid:'), { target: { value: 'true' } });
    fireEvent.change(screen.getByLabelText('Schade:'), { target: { value: 'false' } });

    // Reset fetch mock before form submission
    global.fetch.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /Voertuig toevoegen/i }));

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('https://localhost:7289/api/vehicle/voeg-voertuig-toe', expect.any(Object));
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});