const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const jobIsDone = () => {
  process.stdout.write('\nJob is done!\n');
  rl.close();
  stream.end();
  process.exit();
}

process.stdout.write('Enter text: ');
rl.on('line', data => {data == 'exit' ? jobIsDone() : stream.write(data+'\n')});
process.on('exit', () => jobIsDone());
