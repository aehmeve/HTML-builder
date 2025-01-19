const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

const origFolder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

async function copyDir() {
  async function copyFolder() {
    await fsPromises.mkdir(newFolder);
    const filesToCopy = await fsPromises.readdir(origFolder, (err) => {
      if (err) console.log(`Oops: ${err}`);
    });
    filesToCopy.forEach((file) => {
      fs.copyFile(
        path.join(origFolder, file),
        path.join(newFolder, file),
        (err) => {
          if (err) console.log(`Copy error: ${err}`);
        },
      );
    });
  }

  try {
    await fsPromises.access(newFolder);
    await fsPromises.rm(newFolder, { force: true, recursive: true });
    copyFolder();
  } catch {
    copyFolder();
  }
}

copyDir();
