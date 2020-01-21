process.on("unhandledRejection", err => {
  throw err;
});

const inquirer = require("inquirer");
const emoji = require("node-emoji");
const config = require("./readConfig");
const saveTask = require("./saveTask");

const taskNumberQuestion = () => [
  {
    type: "input",
    name: "numbers",
    message: "How many things you want to get done today?",
    default: () => 3,
    validate: input => {
      return !isNaN(parseInt(input, 10));
    }
  }
];

const createQuestions = tasks => {
  const ques = [];
  for (let i = 0; i < tasks; i++) {
    ques.push({
      type: "input",
      name: `task_${i}`,
      message: emoji.emojify(`:white_check_mark: Task ${i + 1}:`)
    });
  }
  return ques;
};

const saveLocationQuestions = () => {
  const choices = [new inquirer.Separator()];
  const oldFile = config.readFileLocation();
  if (oldFile) {
    choices.push(`Save at previous location [${config.getBaseName(oldFile)}]`);
  }
  choices.push("Save in new file");
  choices.push("Copy to clipboard");
  choices.push(new inquirer.Separator());
  return [
    {
      type: "list",
      name: "location",
      message: "Where do you want to save?",
      choices
    }
  ];
};

const saveNewFileQuestion = () => {
  return [
    {
      type: "input",
      name: "fileName",
      message: "Enter new file name",
      default: () => "tasks.md"
    }
  ];
};

const parseAnswers = answers => {
  const keys = Object.keys(answers);
  const ans = [];
  for (let i = 0; i < keys.length; i++) {
    ans.push(answers[keys[i]]);
  }
  return ans;
};

const askFileName = async tasks => {
  try {
    const { fileName } = await inquirer.prompt(saveNewFileQuestion());
    saveTask.saveToNewFile(fileName, tasks);
  } catch (err) {
    config.errorMsg(err.message);
    askFileName(tasks);
  }
};

const main = async () => {
  const options = await inquirer.prompt(taskNumberQuestion());
  const tasks = parseAnswers(
    await inquirer.prompt(createQuestions(parseInt(options.numbers, 10)))
  );
  const saveLocation = await inquirer.prompt(saveLocationQuestions());
  if (saveLocation.location === "Save in new file") {
    askFileName(tasks);
  } else if (saveLocation.location.indexOf("previous") > -1) {
    saveTask.saveToExistingFile(tasks);
  } else if (saveLocation.location === "Copy to clipboard") {
    saveTask.saveToClipboard(tasks);
  }
};

module.exports = main;
