const originalConsole = { ...console };
const originalProcessExit = process.exit;

// Store original implementations
beforeAll(() => {
  // Mock console methods
  global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  };

  // Mock process.exit
  process.exit = jest.fn((code) => {
    console.log(`Process.exit called with code ${code}`);
  });
});

// Restore originals
afterAll(() => {
  global.console = originalConsole;
  process.exit = originalProcessExit;
});

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Set default timeout
jest.setTimeout(30000);