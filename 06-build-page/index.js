const { readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const dirStyles = path.join(__dirname, 'styles');
const dirAssets = path.join(__dirname, 'assets');
const dirComponents = path.join(__dirname, 'components');
const dirOut = path.join(__dirname, 'project-dist');

async function clearInstance() {
  try {
    await fs.rmdirSync(dirOut, { recursive: true, force: true }, (err) => {});
    await fs.mkdir(dirOut, { recursive: true }, (err) => {if (err) console.error(err);});
  } catch (err) {
    console.error(err);
  }
}

async function copyAssets(pathFrom, pathTo, dirName) {
  try {
    await fs.mkdir(path.join(pathTo, dirName), { recursive: true }, (err) => {if (err) console.error(err);});

    const files = await readdir(pathFrom, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && file.name !== '.DS_Store') {
        let input = fs.createReadStream(path.join(pathFrom, file.name));
        let output = fs.createWriteStream(path.join(pathTo, dirName, file.name));      
        input.pipe(output);
      }
      else if (file.name !== '.DS_Store') {
        copyAssets(path.join(pathFrom, file.name), path.join(pathTo, dirName), file.name);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function collectCSS() {
  try {
    const outputStyles = fs.createWriteStream(path.join(dirOut, 'style.css'), 'utf-8');
    const files = await readdir(dirStyles);
    for (const file of files)
      if (path.extname(file).substring(1).toLowerCase() === 'css') {
        let input = fs.createReadStream(path.join(dirStyles, file));
        input.pipe(outputStyles);  
      }
  } catch (err) {
    console.error(err);
  }
}

async function collectHTML() {
//  const inputTemplate = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
//  const outputIndex = fs.createWriteStream(path.join(dirOut, 'index.html'), 'utf-8');
//  inputTemplate.pipe(outputIndex);

  try {
    let template = (await readFile(path.join(__dirname, 'template.html'))).toString();
    const templateComponents = template.match(/{{(.*)}}/gi);

    if (templateComponents) {
      for await (const component of templateComponents) {
        const componentName = component.replace('{{', '').replace('}}', '');
        const componentSource = (await readFile(path.join(dirComponents, componentName+'.html'))).toString();
        template = template.replace(component, componentSource);
      }

      await writeFile(path.join(dirOut, 'index.html'), template);
    }

  } catch (err) {
    console.log(err.message);
  }
}

async function htmlBuilder() {
  await clearInstance();
  await copyAssets(dirAssets, dirOut, 'assets');
  await collectCSS();
  await collectHTML();
}

htmlBuilder();