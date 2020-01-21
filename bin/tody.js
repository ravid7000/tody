#! /usr/bin/env node

const commander = require("commander");
const fs = require("fs");
const path = require("path");
const programOptions = require("../lib/options");
const createTask = require("../lib/createTask");
const { readPackageFile } = require("../lib/readConfig");

const getPkg = (() => JSON.parse(readPackageFile()))();

const main = () => {
  const program = programOptions(new commander.Command())
    .version(getPkg.version, "-v, --version", "Current version of Tody.")
    .parse(process.argv);
  if (program.template) {
    console.log("Open default template");
  } else {
    /**
     * Otherwise create tasks
     */
    createTask();
  }
};

main();
