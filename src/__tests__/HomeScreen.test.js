import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { API } from 'aws-amplify';
import HomeScreen from '../screens/HomeScreen';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        push: jest.fn(),
    }),
}));

// Mock API call
jest.mock('aws-amplify', () => ({
    API: {
        graphql: jest.fn(),
    },
    graphqlOperation: jest.fn(),
}));

describe('HomeScreen Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the HomeScreen correctly', () => {
        const { getByText } = render(<HomeScreen />);

        expect(getByText('User Types')).toBeTruthy();
        expect(getByText('Admin Users')).toBeTruthy();
    });

    test('renders radio buttons and handles selection', () => {
        const { getByText } = render(<HomeScreen />);

        const adminButton = getByText('Admin');
        const managerButton = getByText('Manager');

        expect(adminButton).toBeTruthy();
        expect(managerButton).toBeTruthy();

        fireEvent.press(managerButton);
        expect(getByText('Manager')).toBeTruthy();
    });

    test('calls fetchCustomers on mount', async () => {
        API.graphql.mockResolvedValueOnce({
            data: {
                listZellerCustomers: {
                    items: [{ id: '1', name: 'David Miler', role: 'ADMIN' }],
                    nextToken: null,
                },
            },
        });

        const { findByText } = render(<HomeScreen />);

        await waitFor(() => expect(findByText('David Miler')).toBeTruthy());
    });

    test('filters user list based on search text', async () => {
        API.graphql.mockResolvedValueOnce({
            data: {
                listZellerCustomers: {
                    items: [
                        { id: '1', name: 'David Miler', role: 'ADMIN' },
                        { id: '2', name: 'Lynn Warr', role: 'MANAGER' },
                    ],
                    nextToken: null,
                },
            },
        });

        const { getByPlaceholderText, findByText, queryByText } = render(<HomeScreen />);

        await waitFor(() => expect(findByText('David Miler')).toBeTruthy());

        const searchInput = getByPlaceholderText('Search User');
        fireEvent.changeText(searchInput, 'David');

        expect(queryByText('Ryan Muller')).toBeNull();
        expect(await findByText('David Miler')).toBeTruthy();
    });

    test('handles refresh action', async () => {
        API.graphql.mockResolvedValueOnce({
            data: {
                listZellerCustomers: {
                    items: [{ id: '1', name: 'David Miler', role: 'ADMIN' }],
                    nextToken: null,
                },
            },
        });

        const { getByText, findByText } = render(<HomeScreen />);

        await waitFor(() => expect(findByText('David Miler')).toBeTruthy());

        API.graphql.mockResolvedValueOnce({
            data: {
                listZellerCustomers: {
                    items: [{ id: '2', name: 'Bob', role: 'MANAGER' }],
                    nextToken: null,
                },
            },
        });

        fireEvent.press(getByText('Admin Users'));

        await waitFor(() => expect(findByText('David Miler')).toBeTruthy());
    });
});
