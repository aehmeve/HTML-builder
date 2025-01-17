const fs = require('fs');
const path = require('path');

const pathToStyles = path.join(__dirname, 'styles');

function createProperFilesArr(initArr) {
  const newArr = [];
  initArr.forEach((fileDirent) => {
    if (
      fileDirent.isFile() &&
      fileDirent.name.slice(fileDirent.name.indexOf('.')) === '.css'
    ) {
      newArr.push(fileDirent.name);
    }
  });
  return newArr;
}

function copyFilesContent(arr) {
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  const output = fs.createWriteStream(bundlePath);
  arr.forEach((file) => {
    const pathToFile = path.join(pathToStyles, file);
    const textStream = fs.createReadStream(pathToFile, 'utf-8');
    textStream.on('data', (chunk) => output.write(chunk));
  });
}

new Promise(function (resolve, reject) {
  fs.readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
    if (err) {
      reject(console.log(`Couldn't read content of folder:\n${err}`));
    } else {
      resolve(files);
    }
  });
})
  .then(createProperFilesArr)
  .then(copyFilesContent);
