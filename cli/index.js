var figlet = require("figlet");
var cv = require('./converter');
var converter = new cv();
var fileDialog = require('file-dialog')
var inquirer = require('inquirer');

console.clear();
console.log(figlet.textSync("LS2LC", "Big Money-ne"));
console.log("\n\n\t\tMade by SirTenzin\n");

inquirer.registerPrompt('filefolder', require('inquirer-filefolder-prompt'));
inquirer.prompt({
  type: 'filefolder',
  name: 'file',
  message: 'Please select the config.',
  dialog: {
      type: 'OpenFileDialog',
      config: {
          'title': 'Open Config (svb, loli, anom)',
      },
  },
  validate: function(file) {
    if (file.length === 0) {
      return 'No file selected.';
    }
    return true;
  }
}).then(answers => {
  converter.start(answers.file)
});