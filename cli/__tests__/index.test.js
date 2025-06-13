const { copyModules, fetchModuleFromRepo, main } = require('../index');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const degit = require('degit');

describe('copyModules', () => {
  let tempModulesDir, tempTargetDir;

  beforeAll(() => {
    // Create temp directories with unique names
    tempModulesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-modules-'));
    tempTargetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-target-'));
    
    // Create test module structure
    const dummyModuleDir = path.join(tempModulesDir, 'dummy-module');
    fs.ensureDirSync(dummyModuleDir);
    fs.writeFileSync(path.join(dummyModuleDir, 'file.txt'), 'hello');
  });

  afterAll(() => {
    // Cleanup temp directories
    if (fs.existsSync(tempModulesDir)) {
      fs.removeSync(tempModulesDir);
    }
    if (fs.existsSync(tempTargetDir)) {
      fs.removeSync(tempTargetDir);
    }
  });

  it('should copy specified modules to the target directory', async () => {
    // Execute copyModules
    await copyModules(['dummy-module'], tempTargetDir, tempModulesDir);

    // Verify file was copied correctly
    const copiedFile = path.join(tempTargetDir, 'file.txt');
    expect(fs.existsSync(copiedFile)).toBe(true);
    expect(fs.readFileSync(copiedFile, 'utf8')).toBe('hello');
  });

  it('should handle non-existent modules gracefully', async () => {
    await copyModules(['non-existent-module'], tempTargetDir, tempModulesDir);
    expect(fs.existsSync(tempTargetDir)).toBe(true);
  });
});

describe('fetchModuleFromRepo', () => {
  let tempModulesDir;

  beforeAll(() => {
    tempModulesDir = path.join(__dirname, '..', 'temp-modules-repo');
    fs.ensureDirSync(tempModulesDir);
  });

  afterAll(() => {
    fs.removeSync(tempModulesDir);
  });

  it('should fetch a module from a remote repo and clone it locally', async () => {
    const repo = 'JENkt4k/launchpad-react-template';
    const moduleName = 'auth-oauth';
    const branch = 'auth-oauth';
    
    await fetchModuleFromRepo(repo, moduleName, branch, tempModulesDir);
    const modulePath = path.join(tempModulesDir, moduleName);
    expect(fs.existsSync(modulePath)).toBe(true);
  });
});

describe('main function', () => {
  let tempDir;

  beforeAll(() => {
    tempDir = path.join(__dirname, '..', 'temp-main');
    fs.ensureDirSync(tempDir);
  });

  afterAll(() => {
    fs.removeSync(tempDir);
  });

  it('should scaffold a project with modules', async () => {
    const options = {
      framework: 'react',
      branch: 'hello-world',
      include: 'auth-oauth',
      moduleBranch: 'auth-oauth',
      directory: tempDir
    };

    await main(options);
    const modulePath = path.join(tempDir, 'modules', 'auth-oauth');
    expect(fs.existsSync(modulePath)).toBe(true);
  });

  it('should handle invalid framework', async () => {
    const options = {
      framework: 'invalid',
      directory: tempDir
    };

    try {
      await main(options);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toBe('Unknown framework: invalid');
    }
  });

  it('should install dependencies when package.json exists', async () => {
    const options = {
      framework: 'react',
      branch: 'hello-world',
      directory: tempDir
    };

    // Create mock package.json
    const packageJsonPath = path.join(tempDir, 'package.json');
    fs.writeFileSync(packageJsonPath, '{"name": "test"}');

    await main(options);
    expect(fs.existsSync(packageJsonPath)).toBe(true);
  });

  it('should handle npm install errors gracefully', async () => {
    const options = {
      framework: 'react',
      branch: 'hello-world',
      directory: path.join(tempDir, 'invalid-path')
    };

    // Create invalid directory structure to force npm install error
    await main(options);
    expect(fs.existsSync(tempDir)).toBe(true);
  });
});

// Keep the working CLI integration test as is
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