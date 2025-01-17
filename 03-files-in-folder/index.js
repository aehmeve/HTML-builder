const fs = require('node:fs');
const path = require('node:path');

const folderPath = path.join(__dirname, 'secret-folder');
fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log('We have a problem');
  } else {
    console.log('\nSecret folder cointains next files:');
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(file.parentPath, file.name);
        fs.promises
          .stat(filePath, (err) => {
            if (err) {
              console.log('Oops!');
              return;
            }
          })
          .then((stats) => {
            const fileName = file.name.slice(0, file.name.indexOf('.'));
            const fileExtension = file.name.slice(file.name.indexOf('.') + 1);
            console.log(`${fileName} - ${fileExtension} - ${stats.size}b`);
          });
      }
    });
  }
});
