// parser.js
import { parse } from 'json5';

class Parser {
  constructor() {
    this.data = {};
  }

  parseFile(filePath) {
    return new Promise((resolve, reject) => {
      const fs = require('fs');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const jsonData = parse(data);
          this.data = jsonData;
          resolve();
        }
      });
    });
  }

  getData() {
    return this.data;
  }
}

module.exports = Parser;