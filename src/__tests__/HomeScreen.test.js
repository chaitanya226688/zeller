import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { API } from 'aws-amplify';
import HomeScreen from '../screens/HomeScreen';

// Mock the API.graphql call
jest.mock('aws-amplify', () => ({
    API: {
        graphql: jest.fn(),
    },
}));

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

describe('HomeScreen', () => {
    beforeEach(() => {
        // Reset the mock before each test
        API.graphql.mockReset();
    });

    it('renders correctly with initial data', async () => {
        // Mock API response for the initial data
        API.graphql.mockResolvedValue({
            data: {
                listZellerCustomers: {
                    items: [{ id: '1', name: 'John Doe', role: 'ADMIN' }],
                },
            },
        });

        const { getByText } = render(<HomeScreen />);

        await waitFor(() => getByText('John Doe'));

        expect(getByText('John Doe')).toBeTruthy();
    });

    it('renders correctly with multiple users', async () => {
        // Mock API response for multiple users
        API.graphql.mockResolvedValue({
            data: {
                listZellerCustomers: {
                    items: [
                        { id: '1', name: 'John Doe', role: 'ADMIN' },
                        { id: '2', name: 'Jane Smith', role: 'MANAGER' },
                    ],
                },
            },
        });

        const { getByText, getByPlaceholderText } = render(<HomeScreen />);

        await waitFor(() => getByText('John Doe'));

        expect(getByText('John Doe')).toBeTruthy();
        expect(getByText('Jane Smith')).toBeTruthy();
        expect(getByPlaceholderText('Search User')).toBeTruthy();
    });

    it('changes user type when a radio button is clicked', async () => {
        // Mock API response for the initial users
        API.graphql.mockResolvedValue({
            data: {
                listZellerCustomers: {
                    items: [
                        { id: '1', name: 'John Doe', role: 'ADMIN' },
                        { id: '2', name: 'Jane Smith', role: 'MANAGER' },
                    ],
                },
            },
        });

        const { getByText } = render(<HomeScreen />);

        await waitFor(() => getByText('ADMIN'));

        fireEvent.press(getByText('MANAGER'));

        expect(getByText('MANAGER')).toBeTruthy();
    });

    it('filters users based on search text', async () => {
        // Mock API response for multiple users
        API.graphql.mockResolvedValue({
            data: {
                listZellerCustomers: {
                    items: [
                        { id: '1', name: 'John Doe', role: 'ADMIN' },
                        { id: '2', name: 'Jane Smith', role: 'MANAGER' },
                    ],
                },
            },
        });

        const { getByPlaceholderText, getByText } = render(<HomeScreen />);

        await waitFor(() => getByText('John Doe'));

        fireEvent.changeText(getByPlaceholderText('Search User'), 'Jane');

        expect(getByText('Jane Smith')).toBeTruthy();
        expect(() => getByText('John Doe')).toThrow(); // John Doe should no longer be in the list
    });

    it('refreshes the list of users when pulled down', async () => {
        // Mock API response for initial users
        API.graphql.mockResolvedValue({
            data: {
                listZellerCustomers: {
                    items: [
                        { id: '1', name: 'John Doe', role: 'ADMIN' },
                        { id: '2', name: 'Jane Smith', role: 'MANAGER' },
                    ],
                },
            },
        });

        const { getByText, getByTestId } = render(<HomeScreen />);

        await waitFor(() => getByText('John Doe'));

        const flatList = getByTestId('flatlist');
        fireEvent(flatList, 'onRefresh');

        expect(API.graphql).toHaveBeenCalledTimes(2); // The API should be called twice (initial fetch + refresh)
    });

    it('shows loading spinner while fetching data', async () => {
        // Mock API response for the initial data
        API.graphql.mockResolvedValue({
            data: {
                listZellerCustomers: {
                    items: [{ id: '1', name: 'John Doe', role: 'ADMIN' }],
                },
            },
        });

        const { getByTestId, queryByTestId } = render(<HomeScreen />);

        expect(getByTestId('loading-spinner')).toBeTruthy();

        await waitFor(() => queryByTestId('loading-spinner') === null);
    });

    it('handles API error gracefully', async () => {
        // Mock API to throw an error
        jest.spyOn(API, 'graphql').mockImplementationOnce(() => {
            throw new Error('Network Error');
        });

        const { getByText } = render(<HomeScreen />);

        await waitFor(() => getByText('Error fetching customers: Network Error'));

        expect(getByText('Error fetching customers: Network Error')).toBeTruthy();
    });
});
