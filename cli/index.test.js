const { copyModules, fetchModuleFromRepo } = require('./index');
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
  });

  afterAll(() => {
    fs.removeSync(tempModulesDir);
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
    // tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-integration-'));
    tempDir = path.join(__dirname, '..', 'temp');
    // Prepare a dummy module in the modules dir for this test
    const modulesDir = path.join(__dirname, '..', 'modules');
    const dummyModuleDir = path.join(modulesDir, 'auth-oauth');
    fs.ensureDirSync(dummyModuleDir);
    fs.writeFileSync(path.join(dummyModuleDir, 'file.txt'), 'integration');
  });

  // afterAll(() => {
  //   fs.removeSync(tempDir);
  //   // Optionally clean up the dummy module
  //   const modulesDir = path.join(__dirname, '..', 'modules');
  //   fs.removeSync(path.join(modulesDir, 'auth-oauth'));
  // });

  it('should scaffold a project and include a module', () => {
    const framework = 'react';
    const branch = 'auth-oauth';
    const module = 'auth-oauth';
    const cliPath = path.join(__dirname, 'cli.js');
    const cmd = `node "${cliPath}" --framework ${framework} --branch ${branch} --include ${module} --directory "${tempDir}"`;

    console.log('cliPath:', cliPath);
    console.log('framework:', framework);
    console.log('branch:', branch);
    console.log('module:', module);
    console.log('tempDir:', tempDir);
    console.log('cmd:', cmd);

    const output = execSync(cmd, { encoding: 'utf8' });


    expect(output).toMatch(/Cloning/);
    expect(output).toMatch(/Including module/);
    // Check for a real file from the module
    const filePath = path.join(tempDir, 'modules', 'auth-oauth', 'package.json'); 
    expect(fs.existsSync(filePath)).toBe(true);
    //expect(fs.existsSync(path.join(tempDir, 'package.json'))).toBe(true);
    // expect(fs.readFileSync(path.join(tempDir, 'file.txt'), 'utf8')).toBe('integration');
  });
});