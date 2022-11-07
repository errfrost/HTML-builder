const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, 'secret-folder');

async function getDirInfo() {
  try {
    const files = await readdir(dir);
    for (const file of files)
      fs.stat(path.join(dir, file), (err, data) => 
        data.isFile() ? console.log(path.parse(file).name + ' - ' + path.extname(file).substring(1) + ' - ' + data.size):false
      );
  } catch (err) {
    console.error(err);
  }
}

getDirInfo();