const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { copyModules } = require('./index');

describe('copyModules', () => {
  let tempModulesDir, tempTargetDir;

  beforeAll(() => {
    // Create a temporary modules directory with a dummy module
    tempModulesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'modules-'));
    tempTargetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'target-'));
    const dummyModuleDir = path.join(tempModulesDir, 'dummy-module');
    fs.mkdirSync(dummyModuleDir);
    fs.writeFileSync(path.join(dummyModuleDir, 'file.txt'), 'hello');
    // Patch __dirname to point to our temp modules dir for this test
    jest.spyOn(path, 'join').mockImplementation((...args) => {
      if (args[1] === '..' && args[2] === 'modules') return tempModulesDir;
      return path.win32.join(...args);
    });
  });

  afterAll(() => {
    fs.removeSync(tempModulesDir);
    fs.removeSync(tempTargetDir);
    jest.restoreAllMocks();
  });

  it('should copy specified modules to the target directory', async () => {
    await copyModules(['dummy-module'], tempTargetDir);
    const copiedFile = path.join(tempTargetDir, 'file.txt');
    expect(fs.existsSync(copiedFile)).toBe(true);
    expect(fs.readFileSync(copiedFile, 'utf8')).toBe('hello');
  });
});

// test('CLI should execute command successfully', () => {
//     const output = execSync('node cli/index.js someCommand').toString();
//     expect(output).toContain('Expected output');
// });