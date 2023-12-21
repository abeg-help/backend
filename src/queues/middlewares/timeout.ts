import timeout from 'connect-timeout';

// Create the timeout middleware
export const timeoutMiddleware = timeout(60000);
