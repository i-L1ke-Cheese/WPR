/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditRentalRequest from '../src/pages/EditRentalRequest';
import { BrowserRouter } from 'react-router-dom';

// Mock the fetch API
global.fetch = jest.fn((url, options) => {
    if (url.includes('/api/RentalRequest/')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                startDate: '2023-01-01',
                endDate: '2023-01-10',
                intention: 'Vacation',
                farthestDestination: 'Paris',
                suspectedKm: 1000,
                privateRenterId: 'user123',
                businessRenterId: null
            })
        });
    } else if (url.includes('/api/Account/getCurrentAccount')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 'user123' })
        });
    } else if (url.includes('/api/RentalRequest/update-huuraanvraag/')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({})
        });
    }
    return Promise.reject(new Error('Unknown API endpoint'));
});

test('updates rental request successfully', async () => {
    // Mock window.alert
    window.alert = jest.fn();

    render(
        <BrowserRouter>
            <EditRentalRequest />
        </BrowserRouter>
    );

    // Wait for the rental request data to be fetched and form to be populated
    await waitFor(() => {
        expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument();
    });

    // Change the intention field
    const intentionInput = screen.getByLabelText(/Intentie:/i);
    fireEvent.change(intentionInput, { target: { value: 'Business' } });

    // Submit the form
    const submitButton = screen.getByText(/Werk huuraanvraag bij/i);
    fireEvent.click(submitButton);

    // Wait for the alert to be called
    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Huuraanvraag succesvol aangepast');
    });
});