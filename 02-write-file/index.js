const fs = require('node:fs');
const path = require('node:path');
const { stdin, stdout } = require('node:process');

const outputPath = path.join(__dirname, 'output.txt');
const outputFile = fs.createWriteStream(outputPath);

console.log('Hello! Enter your message in terminal.');
process.on('exit', () => console.log('Thank you for your time!'));
process.on('SIGINT', () => {
  process.exit();
});
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    outputFile.write(data);
  }
});