const fs = require('fs');
const path = require('path');
const { config } = require('./readConfig');

function createLocationFile(locationPath) {
    fs.mkdirSync(path.dirname(locationPath))
    fs.writeFileSync(locationPath, '');
}

function createTemplateFile(templatePath) {
    const template = "# What I'm working on <date> at <time>:\n- <repeat tasks>";
    fs.mkdirSync(path.dirname(templatePath))
    fs.writeFileSync(templatePath, template);
}

function createMissingFiles() {
    console.log('Setting up...')
    const basePath = path.join(__dirname, '../');
    const locationPath = path.join(basePath, config.location);
    if (!fs.existsSync(locationPath)) {
        createLocationFile(locationPath);
    }
    const templatePath = path.join(basePath, config.template);
    if (!fs.existsSync(templatePath)) {
        createTemplateFile(templatePath);
    }
    console.log('Done!')
}

createMissingFiles();