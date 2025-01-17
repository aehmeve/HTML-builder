const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const path = require('node:path');

const projectPath = path.join(__dirname, 'project-dist');
const projectAssetsPath = path.join(projectPath, 'assets');
const assetsPath = path.join(__dirname, 'assets');

async function assembleHTML() {
  await createDirectories();
  copyFiles();
  createStyleFile();
  createIndex();
}

async function createDirectories() {
  await fs.mkdir(projectPath, { recursive: true }, (err) => {
    if (err) console.log(`Can't create "project-dist":\n ${err}`);
  });
  await fs.mkdir(projectAssetsPath, { recursive: true }, (err) => {
    if (err) console.log(`Can't create "assets":\n ${err}`);
  });

  const folders = fsPromises.readdir(assetsPath);
  folders.then((arr) => {
    arr.forEach((folder) => {
      fs.mkdir(
        path.join(projectAssetsPath, folder),
        { recursive: true },
        (err) => {
          if (err) console.log(`Can't create "${folder}":\n${err}`);
        },
      );
    });
  });
}

async function copyFiles() {
  fsPromises
    .readdir(assetsPath, { recursive: true, withFileTypes: true })
    .then((direntArr) => {
      direntArr.forEach((file) => {
        if (file.isFile()) {
          const assignedFolder = file.parentPath.slice(
            file.parentPath.lastIndexOf('\\') + 1,
          );
          fs.copyFile(
            path.join(assetsPath, assignedFolder, file.name),
            path.join(projectAssetsPath, assignedFolder, file.name),
            (err) => {
              if (err) console.log(`Can't copy ${file.name}:\n${err}`);
            },
          );
        }
      });
    });
}

async function createStyleFile() {
  const styleFilePath = path.join(projectPath, 'style.css');
  const output = fs.createWriteStream(styleFilePath);

  fsPromises.readdir(path.join(__dirname, 'styles')).then(function (arr) {
    arr.forEach((fileName) => {
      const pathToFile = path.join(__dirname, 'styles', fileName);
      const textStream = fs.createReadStream(pathToFile, 'utf-8');
      textStream.on('data', (chunk) => output.write(chunk));
    });
  });
}

async function replaceTags(html, componentsArr, componentsPath) {
  let newHTML = html;
  for (let i = 0; i < componentsArr.length; i += 1) {
    const componentFilePath = path.join(componentsPath, componentsArr[i]);
    const componentContent = await fsPromises.readFile(
      componentFilePath,
      'utf-8',
    );
    const fileName = componentsArr[i].slice(
      0,
      componentsArr[i].lastIndexOf('.'),
    );
    newHTML = newHTML.replace(`{{${fileName}}}`, componentContent);
  }

  return newHTML;
}

async function createIndex() {
  const componentsPath = path.join(__dirname, 'components');
  const componentsArr = await fsPromises.readdir(componentsPath);
  let html = await fsPromises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  const replacedTagsHTML = await replaceTags(
    html,
    componentsArr,
    componentsPath,
  );

  fs.writeFile(
    path.join(projectPath, 'index.html'),
    replacedTagsHTML,
    (err) => {
      if (err) console.log(`Can't create new index file:\n ${err}`);
    },
  );
}

assembleHTML();
