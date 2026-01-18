// parser.js

const { createInterface } = require('readline');
const { pipeline } = require('stream');
const { promisify } = require('util');
const { join } = require('path');
const fs = require('fs');
const { createReadStream } = require('fs');
const { createWriteStream } = require('fs');
const { strip } = require('strip-ansi');

const readLines = promisify(createInterface({
  input: process.stdin,
  crlfDelay: Infinity
}).createInterface().readline);

const parseFile = async (filePath) => {
  const fileStream = createReadStream(filePath);
  const writerStream = createWriteStream('output.txt');
  const parser = {
    read: () => {
      fileStream.on('data', (data) => {
        const line = data.toString();
        if (line.trim()) {
          const trimmedLine = strip(line);
          writerStream.write(trimmedLine + '\n');
        }
      });
    }
  };

  pipeline(fileStream, parser, writerStream, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

const main = async () => {
  const filePath = process.argv[2];
  if (filePath) {
    await parseFile(filePath);
  } else {
    const lines = await readLines();
    const trimmedLines = lines.map(line => strip(line));
    const writerStream = createWriteStream('output.txt');
    writerStream.write(trimmedLines.join('\n'));
  }
};

main().catch((err) => {
  console.error(err);
});