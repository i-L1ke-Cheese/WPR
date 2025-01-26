/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DashboardBackoffice from '../src/pages/dashboardsForUserTypes/DashboardBackoffice';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'Registration successful!' }),
        })
    );
});

describe('DashboardBackoffice', () => {
    let mockNavigate;

    beforeEach(() => {
        mockNavigate = useNavigate();
    });

    test('should add a new employee', async () => {
        render(
            <Router>
                <DashboardBackoffice />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Wachtwoord:/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/Voornaam:/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText(/Achternaam:/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText(/Geboortedatum:/i), { target: { value: '1990-01-01' } });
        fireEvent.change(screen.getByLabelText(/Functie:/i), { target: { value: 'Backoffice' } });

        fireEvent.click(screen.getByText(/Registreer/i));

        await waitFor(() => {
            expect(screen.getByText('Registration successful!')).toBeInTheDocument();
        });
    });
});