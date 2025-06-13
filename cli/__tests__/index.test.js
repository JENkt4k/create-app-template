const { copyModules, fetchModuleFromRepo } = require('../index');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

describe('copyModules', () => {
  let tempModulesDir, tempTargetDir;

  beforeAll(() => {
    // Create a temporary modules directory with a dummy module
    tempModulesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'modules-'));
    tempTargetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'target-'));
    const dummyModuleDir = path.join(tempModulesDir, 'dummy-module');
    fs.mkdirSync(dummyModuleDir);
    fs.writeFileSync(path.join(dummyModuleDir, 'file.txt'), 'hello');
  });

  afterAll(() => {
    fs.removeSync(tempModulesDir);
    fs.removeSync(tempTargetDir);
  });

  it('should copy specified modules to the target directory', async () => {
    await copyModules(['dummy-module'], tempTargetDir, tempModulesDir);
    const copiedFile = path.join(tempTargetDir, 'file.txt');
    expect(fs.existsSync(copiedFile)).toBe(true);
    expect(fs.readFileSync(copiedFile, 'utf8')).toBe('hello');
  });
});

describe('fetchModuleFromRepo', () => {
  let tempModulesDir;

  beforeAll(() => {
    tempModulesDir = path.join(__dirname, '..', 'modules', 'auth-oauth');
    const modulesDir = path.join(__dirname, '..', 'modules');
    const dummyModuleDir = path.join(modulesDir, 'auth-oauth');
    fs.ensureDirSync(dummyModuleDir);
    fs.writeFileSync(path.join(dummyModuleDir, 'file.txt'), 'integration');
  });

  afterAll(() => {
    fs.removeSync(tempModulesDir);
    const modulesDir = path.join(__dirname, '..', 'modules');
    fs.removeSync(path.join(modulesDir, 'auth-oauth'));
    fs.removeSync(modulesDir);
  });

  it('should fetch a module from a remote repo and clone it locally', async () => {
    const repo = 'JENkt4k/launchpad-react-template';
    const moduleName = 'auth-oauth'; // Make sure this exists in modules/
    const branch = 'auth-oauth';
    await fetchModuleFromRepo(repo, moduleName, branch, tempModulesDir);

    // Check that the subdirectory exists and is not empty
    const modulePath = path.join(tempModulesDir, moduleName);
    const files = fs.existsSync(modulePath) ? fs.readdirSync(modulePath) : [];
    expect(files.length).toBeGreaterThan(0);
  });
});

describe('CLI integration', () => {
  let tempDir;

  beforeAll(() => {
    tempDir = path.join(__dirname, '..', 'temp');
    fs.ensureDirSync(tempDir);
  });

  afterAll(() => {
    fs.removeSync(tempDir);
  });

  it('should scaffold a project and include a module', async () => {
    const framework = 'react';
    const branch = 'hello-world';
    const module = 'auth-oauth';
    // Fix the CLI path to point to the index.js file
    const cliPath = path.join(__dirname, '..', 'index.js');
    const cmd = `node "${cliPath}" --framework ${framework} --branch ${branch} --include ${module} --module-branch ${module} --directory "${tempDir}"`;

    try {
      const output = execSync(cmd, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      expect(output).toMatch(/Cloning/);

      // Check for expected files
      const modulePath = path.join(tempDir, 'modules', module);
      expect(fs.existsSync(modulePath)).toBe(true);
    } catch (error) {
      console.error('Command execution failed:', error.message);
      console.error('Command output:', error.stdout);
      console.error('Command stderr:', error.stderr);
      throw error;
    }
  }, 30000); // Increase timeout for network operations
});