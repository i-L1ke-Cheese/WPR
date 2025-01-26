/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DashboardPrivateRenter from '../src/pages/dashboardsForUserTypes/DashboardPrivateRenter';

beforeEach(() => {
    global.fetch = jest.fn((url) => {
        if (url.includes('reserveringen-van-gebruiker')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    {
                        id: 1,
                        status: 'Confirmed',
                        vehicleBrand: 'Toyota',
                        vehicleType: 'Corolla',
                        vehicleColor: 'Red',
                        startDate: '2023-12-01',
                        endDate: '2023-12-10',
                        intention: 'Vacation',
                        suspectedKm: 500,
                        isDeleted: 0,
                        vehicleId: 101
                    }
                ]),
            });
        } else if (url.includes('getCurrentAccount')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ fName: 'John' }),
            });
        }
        return Promise.reject(new Error('Unknown API endpoint'));
    });
});

describe('DashboardPrivateRenter', () => {
    test('should fetch and display reservations', async () => {
        render(
            <Router>
                <DashboardPrivateRenter />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/Toyota Corolla \(Red\)/i)).toBeInTheDocument();
            expect(screen.getByText(/2023-12-01 tot 2023-12-10/i)).toBeInTheDocument();
            expect(screen.getByText(/Gebruiken voor: Vacation/i)).toBeInTheDocument();
            expect(screen.getByText(/Geschatte afstand: 500/i)).toBeInTheDocument();
        });
    });
});