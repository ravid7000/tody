const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const emoji = require("node-emoji");
const errors = require("./error");

const config = {
  location: "./config/location.tody",
  template: "./template/template.tody",
  defaultExt: "md"
};

const currentDir = path.resolve(__dirname, "../");

const readFileLocation = () => {
  const file = path.join(currentDir, config.location);
  if (!fs.existsSync(file)) {
    throw new Error(errors.package);
  }
  const fileContent = fs.readFileSync(
    path.join(currentDir, config.location),
    "utf8"
  );
  return fileContent.split("\n")[0];
};

const setFileLocation = loc => {
  const file = path.join(currentDir, config.location);
  if (!fs.existsSync(file)) {
    throw new Error(errors.package);
  }
  fs.writeFileSync(file, loc + "\n");
};

const readFileTemplate = () => {
  const file = path.join(currentDir, config.template);
  if (!fs.existsSync(file)) {
    throw new Error(errors.package);
  }
  return fs.readFileSync(path.join(currentDir, config.template), "utf8");
};

const saveToFile = (fileName, content) => {
  fileName = path.resolve(fileName);
  fs.writeFileSync(fileName, content);
  return fileName;
};

const readPackageFile = () =>
  fs.readFileSync(path.join(currentDir, "./package.json"), "utf8");

const readFile = fileName => {
  fileName = path.resolve(fileName);
  if (!fs.existsSync(fileName)) {
    throw new Error(`${fileName} does not exits.`);
  }
  return fs.readFileSync(fileName);
};

const fileExists = fileName => fs.existsSync(path.resolve(fileName));

const isFileNameValid = fileName => {
  fileName = path.basename(fileName);
  if (fileName.indexOf(".") === -1) {
    fileName += config.defaultExt;
  }
  return fileName;
};

const getBaseName = fileName => path.basename(fileName);

const successMsg = msg => {
  msg = chalk.green(msg);
  console.log(emoji.emojify(`:ballot_box_with_check:  ${msg}`));
};

const errorMsg = msg => {
  msg = chalk.red(msg);
  console.log(emoji.emojify(`:white_frowning_face:  ${msg}`));
};

module.exports = {
  readFileLocation,
  setFileLocation,
  readFileTemplate,
  saveToFile,
  readFile,
  fileExists,
  isFileNameValid,
  getBaseName,
  successMsg,
  errorMsg,
  readPackageFile,
  currentDir
};
