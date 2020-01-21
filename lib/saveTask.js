const clipboardy = require("clipboardy");
const config = require("./readConfig");

const parseTemplate = variables => {
  const template = config.readFileTemplate();
  const templateContents = template.split("\n");
  const dateRe = /[<]date[>]/gm;
  const timeRe = /[<]time[>]/gm;
  const loopRe = /[<]repeat\s(\w+)[>]/gm;
  const parsedLines = [];

  templateContents.forEach(line => {
    if (loopRe.test(line)) {
      line.replace(loopRe, (matched, group, idx) => {
        if (variables[group] && Array.isArray(variables[group])) {
          variables[group].forEach(item => {
            parsedLines.push(
              line.substr(0, idx) + item + line.substr(idx + matched.length)
            );
          });
        }
        return "";
      });
    } else {
      line = line
        .replace(dateRe, variables.date)
        .replace(timeRe, variables.time);
      parsedLines.push(line);
    }
  });

  return parsedLines.join("\n");
};

const leadingZero = num => {
  return num < 10 ? "0" + num : num;
};

const getDate = date => {
  return `${leadingZero(date.getDate())}-${leadingZero(
    date.getMonth() + 1
  )}-${leadingZero(date.getFullYear())}`;
};

const getTime = date => {
  let hours = date.getHours();
  let ampm = "AM";
  if (hours > 12) {
    ampm = "PM";
    hours -= 12;
  }
  const mins = date.getMinutes();
  const secs = date.getSeconds();
  return `${leadingZero(hours)}:${leadingZero(mins)}:${leadingZero(
    secs
  )}${ampm}`;
};

const saveToNewFile = (fileName, tasks) => {
  fileName = config.isFileNameValid(fileName);
  let template = parseTemplate({
    date: getDate(new Date()),
    time: getTime(new Date()),
    tasks
  });
  if (config.fileExists(fileName)) {
    const oldFile = config.readFile(fileName);
    template = oldFile + "\n\n\n" + template;
  }
  fileName = config.saveToFile(fileName, template);
  config.setFileLocation(fileName);
  console.log();
  config.successMsg(
    `File saved successfully!!\n${config.getBaseName(fileName)}`
  );
};

const saveToExistingFile = tasks => {
  let template = parseTemplate({
    date: getDate(new Date()),
    time: getTime(new Date()),
    tasks
  });
  fileName = config.readFileLocation();
  if (config.fileExists(fileName)) {
    const oldFile = config.readFile(fileName);
    template = oldFile + "\n\n\n" + template;
  }
  fileName = config.saveToFile(fileName, template);
  config.setFileLocation(fileName);
  console.log();
  config.successMsg(
    `File saved successfully!!\n${config.getBaseName(fileName)}`
  );
};

const saveToClipboard = tasks => {
  let template = parseTemplate({
    date: getDate(new Date()),
    time: getTime(new Date()),
    tasks
  });
  clipboardy.writeSync(template);
  console.log();
  config.successMsg("Copied to clipboard!!");
};

module.exports = {
  saveToNewFile,
  saveToExistingFile,
  saveToClipboard
};
