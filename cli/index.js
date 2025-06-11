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
  debugger;
  const fw = templates[options.framework];
  if (!fw) {
    console.error("Unknown framework: " + options.framework);
    process.exit(1);
  }

  // Base repo for template
  const repo = fw.repo + (options.branch ? "#" + options.branch : "");
  const emitter = degit(repo, { cache: false, force: true });
  const outDir = path.resolve(process.cwd(), options.directory);

  console.log(`📦 Cloning ${repo} into ${outDir}`);
  await emitter.clone(outDir);

  if (options.include) {
    const modules = options.include.split(",");
    // Use either specified module repo or fall back to template repo
    const moduleRepo = options.moduleRepo || fw.repo;
    
    for (const mod of modules) {
      const destPath = path.join(outDir, 'modules', mod.trim());
      // Fetch module directly to destination/modules subdirectory
      await fetchModuleFromRepo(
        moduleRepo,
        mod.trim(), 
        options.moduleBranch || mod.trim(),  // Use specified branch or module name as branch
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
