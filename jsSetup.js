jest.mock('@react-native-community/netinfo', () => ({
    addEventListener: jest.fn(),
    fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    addEventListener: jest.fn(),
    fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));
