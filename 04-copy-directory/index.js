const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const dirIn = path.join(__dirname, 'files');
const dirOut = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.rmdir(dirOut, (err) => {});
    await fs.mkdir(dirOut, { recursive: true }, (err) => {if (err) console.error(err);});

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
