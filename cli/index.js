#!/usr/bin/env node

const { Command } = require("commander");
const degit = require("degit");
const execa = require("execa");
const path = require("path");
const fs = require("fs-extra");
const templates = require("../templates.json");

async function copyModules(modules, targetDir, moduleDir = path.join(__dirname, "..", "modules")) {
  for (const mod of modules) {
    const sourcePath = path.join(moduleDir, mod.trim());
    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠️  Module not found: ${mod}`);
      continue;
    }
    console.log(`📂 Including module: ${mod}`);
    await fs.copy(sourcePath, targetDir, {
      overwrite: true,
      errorOnExist: false
    });
  }
}

async function fetchModuleFromRepo(repo, moduleName, branch, localModulesDir) {
  const modulePath = `modules/${moduleName}`;
  const repoSpec = `${repo}/${modulePath}${branch ? "#" + branch : ""}`;
  const dest = path.join(localModulesDir, moduleName);

  console.log(`⬇️  Fetching module "${moduleName}" from ${repoSpec}`);
  await degit(repoSpec, { cache: false, force: true }).clone(dest);
}

async function main(options) {
  const { framework, branch, include, moduleBranch, directory } = options;
  const frameworks = {
    react: {
      repo: 'JENkt4k/launchpad-react-template',
      defaultBranch: 'main'
    }
    // Add more frameworks as needed
  };

  const frameworkConfig = frameworks[framework];
  if (!frameworkConfig) {
    throw new Error(`Unknown framework: ${framework}`);
  }

  // Base repo for template
  const repo = frameworkConfig.repo + (branch ? "#" + branch : "");
  const emitter = degit(repo, { cache: false, force: true });
  const outDir = path.resolve(process.cwd(), directory);

  console.log(`📦 Cloning ${repo} into ${outDir}`);
  await emitter.clone(outDir);

  if (include) {
    const modules = include.split(",");
    // Use either specified module repo or fall back to template repo
    const moduleRepo = options.moduleRepo || frameworkConfig.repo;
    
    for (const mod of modules) {
      const destPath = path.join(outDir, 'modules', mod.trim());
      // Fetch module directly to destination/modules subdirectory
      await fetchModuleFromRepo(
        moduleRepo,
        mod.trim(), 
        moduleBranch || mod.trim(),  // Use specified branch or module name as branch
        path.join(outDir, 'modules')
      );
    }
  }

  if (fs.existsSync(path.join(outDir, "package.json"))) {
    console.log("📦 Installing dependencies...");
    await execa("npm", ["install"], { cwd: outDir, stdio: "inherit" });
  }

  console.log("✅ Done!");
}

if (require.main === module) {
  const program = new Command();

  program
    .name("create-app-template")
    .description("Scaffold a framework template with evolution")
    .requiredOption("-f, --framework <name>", "Framework to use")
    .option("-b, --branch <branch>", "Template evolution branch to use")
    .option("-i, --include <modules>", "Comma-separated modules to merge")
    .option("-d, --directory <dir>", "Target directory", ".")
    .option("--module-repo <repo>", "Remote repo for modules")
    .option("--module-branch <branch>", "Branch for remote modules");

  program.parse(process.argv);
  const options = program.opts();

  main(options).catch(err => {
    console.error("Error:", err);
    process.exit(1);
  });
}

module.exports = {
  copyModules,
  fetchModuleFromRepo,
  main,
};
