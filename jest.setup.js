// Mock console methods to reduce noise in test output
// global.console = {
//   ...console,
//   log: jest.fn(),
//   error: jest.fn(),
//   warn: jest.fn()
// };

// Add longer timeout for all tests
jest.setTimeout(5000);

// Mock process.exit to prevent tests from terminating
const originalProcessExit = process.exit;
process.exit = jest.fn((code) => {
  console.log(`Process.exit called with code ${code}`);
});

// Cleanup after all tests
afterAll(() => {
  process.exit = originalProcessExit;
});