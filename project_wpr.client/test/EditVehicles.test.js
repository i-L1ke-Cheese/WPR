/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditVehicles from '../src/pages/EditVehicles';
import { BrowserRouter } from 'react-router-dom';

// Mock the fetch API
global.fetch = jest.fn((url, options) => {
    if (url.includes('/api/Vehicle/alle-voertuigen')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                cars: [
                    {
                        id: '1',
                        brand: 'Toyota',
                        type: 'Corolla',
                        color: 'Red',
                        yearOfPurchase: '2020',
                        licensePlate: 'ABC123',
                        description: 'A reliable car',
                        rentalPrice: '50',
                        isAvailable: true,
                        isDamaged: false,
                        vehicleType: 'car',
                        transmissionType: 'Automatic'
                    }
                ],
                campers: [],
                caravans: []
            })
        });
    } else if (url.includes('/api/Account/getCurrentAccount')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ role: 'EmployeeBackOffice' })
        });
    } else if (url.includes('/api/vehicle/update-voertuig/1')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                id: '1',
                brand: 'Toyota',
                type: 'Corolla',
                color: 'Blue', // Updated color
                yearOfPurchase: '2020',
                licensePlate: 'ABC123',
                description: 'A reliable car',
                rentalPrice: '50',
                isAvailable: true,
                isDamaged: false,
                vehicleType: 'car',
                transmissionType: 'Automatic'
            })
        });
    }
    return Promise.reject(new Error('Unknown API endpoint'));
});

test('updates vehicle successfully', async () => {
    render(
        <BrowserRouter>
            <EditVehicles />
        </BrowserRouter>
    );

    // Wait for the vehicle data to be fetched and form to be populated
    await waitFor(() => {
        expect(screen.getByText('ABC123')).toBeInTheDocument();
    });

    // Click the edit button to populate the form
    const editButton = screen.getByText(/Bewerken/i);
    fireEvent.click(editButton);

    // Change the color field
    const colorInput = screen.getByPlaceholderText(/Kleur/i);
    fireEvent.change(colorInput, { target: { value: 'Blue' } });

    // Submit the form
    const submitButton = screen.getByText(/Opslaan/i);
    fireEvent.click(submitButton);

    // Verify the updated color in the table
    await waitFor(() => {
        expect(screen.getByText('Blue')).toBeInTheDocument();
    });
});