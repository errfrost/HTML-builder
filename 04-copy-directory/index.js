const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const dirIn = path.join(__dirname, 'files');
const dirOut = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    fs.rmSync(dirOut, { force: true, recursive: true });
    fs.mkdirSync(dirOut, { recursive: true });

    const files = await readdir(dirIn);
    for (const file of files) {
      let input = fs.createReadStream(path.join(dirIn, file));
      let output = fs.createWriteStream(path.join(dirOut, file));      
      input.pipe(output);
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir();
