/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardFrontOffice from '../src/pages/dashboardsForUserTypes/DashboardFrontOffice';

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
    })
);

describe('DashboardFrontOffice', () => {
    beforeEach(() => {
        global.fetch.mockClear();
        global.alert = jest.fn();
    });

    test('renders DashboardFrontOffice component', () => {
        render(
            <BrowserRouter>
                <DashboardFrontOffice />
            </BrowserRouter>
        );

        expect(screen.getByText(/Huuraanvragen/i)).toBeInTheDocument();
    });

    test('submits a damage report', async () => {
        await act(async () => {
            render(
                <BrowserRouter>
                    <DashboardFrontOffice />
                </BrowserRouter>
            );
        });

        fireEvent.change(screen.getByLabelText(/Car ID:/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Action:/i), { target: { value: 'reportDamage' } });
        fireEvent.change(screen.getByLabelText(/Damage Description:/i), { target: { value: 'Test damage' } });
        fireEvent.change(screen.getByLabelText(/Status:/i), { target: { value: 'Beschadigd' } });

        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'https://localhost:7289/api/DamageReport/maak-schademelding',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        vehicleId: '1',
                        date: new Date().toISOString().split('T')[0],
                        description: 'Test damage',
                        employeeId: 'currentEmployeeId',
                        status: 'Beschadigd'
                    }),
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            );
        });
    });

    test('submits an edit rental request', async () => {
        // Mock rental requests data
        const rentalRequests = [
            {
                id: '1',
                vehicleId: '1',
                status: 'goedgekeurd',
                intention: 'intention',
                farthestDestination: 'farthestDestination',
                startDate: '01-01-0001',
                endDate: '02-01-0001',
                suspectedKm: '30',
                vehicleBrand: 'Brand',
                vehicleType: 'Type',
                renterFirstName: 'FirstName',
                renterLastName: 'LastName'
            }
        ];

        // Mock fetch response for rental requests
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(rentalRequests),
            })
        );

        await act(async () => {
            render(
                <BrowserRouter>
                    <DashboardFrontOffice />
                </BrowserRouter>
            );
        });

        // Wait for rental requests to be rendered
        await waitFor(() => {
            expect(screen.getByText(/Huuraanvragen/i)).toBeInTheDocument();
        });

        // Simulate clicking the "Acties" button
        fireEvent.click(screen.getByText(/Acties/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/Car ID:/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Action:/i), { target: { value: 'editRentalRequest' } });
        fireEvent.change(screen.getByLabelText(/Status:/i), { target: { value: 'uitgegeven' } });

        // Reset fetch mock before form submission
        global.fetch.mockClear();

        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'https://localhost:7289/api/RentalRequest/update-huuraanvraag/1',
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify({
                        vehicleId: '1',
                        status: 'uitgegeven',
                        intention: 'intention',
                        farthestDestination: 'farthestDestination',
                        startDate: '01-01-0001',
                        endDate: '02-01-0001',
                        suspectedKm: '30'
                    }),
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            );
        });
    });

    test('fetches rental requests on mount', async () => {
        await act(async () => {
            render(
                <BrowserRouter>
                    <DashboardFrontOffice />
                </BrowserRouter>
            );
        });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'https://localhost:7289/api/RentalRequest/reserveringen-van-alle-autos'
            );
        });
    });

    test('fetches damage reports on mount', async () => {
        await act(async () => {
            render(
                <BrowserRouter>
                    <DashboardFrontOffice />
                </BrowserRouter>
            );
        });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'https://localhost:7289/api/DamageReport/alle-voertuigen'
            );
        });
    });
});