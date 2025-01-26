/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateCompany from '../src/pages/CreateCompany';

describe('CreateCompany', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    test('renders CreateCompany form and submits data', async () => {
        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ role: ['CompanyAdmin'], id: '123', email: 'test@example.com' }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ name: 'Test Company', adress: 'Test Adress', KVK_number: '12345678' }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });

        render(
            <BrowserRouter>
                <CreateCompany />
            </BrowserRouter>
        );

        // Wait for user info to be fetched
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        // Fill out the form
        fireEvent.change(screen.getByPlaceholderText('Voer uw bedrijfsnaam in'), { target: { value: 'Test Company' } });
        fireEvent.change(screen.getByPlaceholderText('Voer uw adres in'), { target: { value: 'Test Adress' } });
        fireEvent.change(screen.getByPlaceholderText('Voer uw KVK nummer in'), { target: { value: '12345678' } });

        // Submit the form
        fireEvent.click(screen.getByText('Maak aan'));

        // Wait for the form submission to complete
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3));

        // Check if the confirmation message is displayed
        expect(screen.getByText('Uw bedrijf is aangemaakt')).toBeInTheDocument();
    });
});