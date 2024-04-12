const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) {
    console.log(`Oops: ${err} happened!`);
  }
});

fs.promises.readdir(path.join(__dirname, 'files'), (err) => {
  if (err) {
    console.log(`Oops: ${err}`);
  }
}).then((files) => {
  files.forEach((file) => {
    fs.copyFile(path.join(__dirname, 'files', file),
      path.join(__dirname, 'files-copy', file),
      (err) => {
        if (err) {
          console.log(`Oops! ${err}`);
        }
      });
  });
});