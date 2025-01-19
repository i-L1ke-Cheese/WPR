/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import FrontOffice from '../src/pages/FrontOffice';
import { BrowserRouter } from 'react-router-dom';

describe('FrontOffice', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        );
        global.alert = jest.fn();
    });

    test('renders FrontOffice component', () => {
        render(
            <BrowserRouter>
                <FrontOffice />
            </BrowserRouter>
        );

        expect(screen.getByText(/Front Office/i)).toBeInTheDocument();
    });

    test('submits a damage report', async () => {
        await act(async () => {
            render(
                <BrowserRouter>
                    <FrontOffice />
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
        await act(async () => {
            render(
                <BrowserRouter>
                    <FrontOffice />
                </BrowserRouter>
            );
        });

        fireEvent.change(screen.getByLabelText(/Car ID:/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Action:/i), { target: { value: 'editRentalRequest' } });
        fireEvent.change(screen.getByLabelText(/Status:/i), { target: { value: 'goedgekeurd' } });

        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'https://localhost:7289/api/RentalRequest/update-huuraanvraag/',
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify({
                        vehicleId: '1',
                        status: 'goedgekeurd',
                        intention: '',
                        farthestDestination: ''
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
                    <FrontOffice />
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
                    <FrontOffice />
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