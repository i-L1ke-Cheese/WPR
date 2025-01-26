/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DashboardVehicleManager from '../src/pages/dashboardsForUserTypes/DashboardVehicleManager';

beforeEach(() => {
    global.fetch = jest.fn((url) => {
        if (url.includes('reserveringen-van-company')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    {
                        id: 1,
                        vehicleBrand: 'Toyota',
                        vehicleType: 'Corolla',
                        vehicleId: 101,
                        startDate: '2023-12-01',
                        endDate: '2023-12-10',
                        firstName: 'John',
                        lastName: 'Doe',
                        status: 'Confirmed',
                        intention: 'Business',
                        suspectedKm: 300,
                        isDeleted: 0,
                    },
                    {
                        id: 2,
                        vehicleBrand: 'Honda',
                        vehicleType: 'Civic',
                        vehicleId: 102,
                        startDate: '2023-11-01',
                        endDate: '2023-11-10',
                        firstName: 'Jane',
                        lastName: 'Smith',
                        status: 'Pending',
                        intention: 'Vacation',
                        suspectedKm: 500,
                        isDeleted: 0,
                    }
                ]),
            });
        } else if (url.includes('getCurrentAccount')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ companyName: 'TestCompany' }),
            });
        }
        return Promise.reject(new Error('Unknown API endpoint'));
    });
});

describe('DashboardVehicleManager', () => {
    test('should fetch and display rental requests', async () => {
        render(
            <Router>
                <DashboardVehicleManager />
            </Router>
        );

        await waitFor(() => {
            const rows = screen.getAllByRole('row');
            expect(rows).toHaveLength(7); // Including header row

            const toyotaRow = rows[1];
            expect(toyotaRow).toHaveTextContent('Toyota Corolla (101)');
            expect(toyotaRow).toHaveTextContent('2023-12-01');
            expect(toyotaRow).toHaveTextContent('2023-12-10');
            expect(toyotaRow).toHaveTextContent('John Doe');
            expect(toyotaRow).toHaveTextContent('Confirmed');

            const hondaRow = rows[2];
            expect(hondaRow).toHaveTextContent('Honda Civic (102)');
            expect(hondaRow).toHaveTextContent('2023-11-01');
            expect(hondaRow).toHaveTextContent('2023-11-10');
            expect(hondaRow).toHaveTextContent('Jane Smith');
            expect(hondaRow).toHaveTextContent('Pending');
        });
    });
});