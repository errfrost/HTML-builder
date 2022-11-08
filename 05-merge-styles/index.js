const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const dirIn = path.join(__dirname, 'styles');
const dirOut = path.join(__dirname, 'project-dist');
const output = fs.createWriteStream(path.join(dirOut, 'bundle.css'), 'utf-8');

async function collectCSS() {
  try {
    const files = await readdir(dirIn);
    for (const file of files)
      if (path.extname(file).substring(1).toLowerCase() === 'css') {
        let input = fs.createReadStream(path.join(dirIn, file));
        input.pipe(output);  
      }
  } catch (err) {
    console.error(err);
  }
}

collectCSS();