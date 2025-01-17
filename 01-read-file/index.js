const fs = require('node:fs');
const path = require('node:path');
const textFilePath = path.join(__dirname, 'text.txt');
const textStream = fs.createReadStream(textFilePath, 'utf-8');
textStream.on('data', (chunk) => console.log(chunk));
