#!/usr/bin/env node

const { Command } = require("commander");
const { main } = require("./index");

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

main(program.opts()).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});