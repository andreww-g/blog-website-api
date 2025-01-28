export const mockAuthService = {
  loginUser: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });
  }),

  refreshAccessToken: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });
  }),
}; 