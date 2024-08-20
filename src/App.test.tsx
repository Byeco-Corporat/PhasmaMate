import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

describe('App Component', () => {
    test('renders without crashing and displays initial UI elements', () => {
        render(<App />);
        
        // Check that the title is rendered
        expect(screen.getByText('PhasmaMate')).toBeInTheDocument();
        
        // Check that the update button is rendered with initial text
        expect(screen.getByText('Güncelle')).toBeInTheDocument();
        
        // Check that the switches are rendered
        expect(screen.getByText('Hayalet İpuçları')).toBeInTheDocument();
        expect(screen.getByText('Adım Algılayıcı')).toBeInTheDocument();
    });

    test('toggles Hayalet İpuçları switch and updates state', () => {
        render(<App />);
        
        const switchElement = screen.getByLabelText('Hayalet İpuçları');
        expect(switchElement).not.toBeChecked();
        
        // Toggle the switch
        fireEvent.click(switchElement);
        expect(switchElement).toBeChecked();
        
        // Toggle it back
        fireEvent.click(switchElement);
        expect(switchElement).not.toBeChecked();
    });

    test('toggles Adım Algılayıcı switch and updates state', async () => {
        render(<App />);
        
        const switchElement = screen.getByLabelText('Adım Algılayıcı');
        expect(switchElement).not.toBeChecked();
        
        // Toggle the switch
        fireEvent.click(switchElement);
        expect(switchElement).toBeChecked();
        
        // Simulate backend response delay
        await waitFor(() => expect(screen.getByText('Adım Algılayıcı activated!')).toBeInTheDocument());
        
        // Toggle it back
        fireEvent.click(switchElement);
        expect(switchElement).not.toBeChecked();
        
        await waitFor(() => expect(screen.getByText('Adım Algılayıcı deactivated.')).toBeInTheDocument());
    });

    test('handles update button click and shows progress', async () => {
        render(<App />);
        
        const updateButton = screen.getByText('Güncelle');
        
        // Mock fetch response for update check
        globalThis.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ assets: [{ browser_download_url: 'http://example.com/file.zip' }] }),
            })
        );
        
        // Mock fetch response for download
        globalThis.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                headers: {
                    get: () => '1000',
                },
                body: new ReadableStream({
                    start(controller) {
                        controller.enqueue(new Uint8Array([1, 2, 3]));
                        controller.close();
                    },
                }),
            })
        );
        
        fireEvent.click(updateButton);
        
        await waitFor(() => expect(screen.getByText('Güncellemeler kontrol ediliyor...')).toBeInTheDocument());
    });
});
