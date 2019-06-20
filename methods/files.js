let parse = require('csv-parse/lib/sync'),
    path = require('path'),
    log = require('../logger.js'),
    fs = require('fs');

let logger = log.logger;

module.exports.getAddressFromTextFile = function (filepath) {

  var file = readFile(filepath, ".txt");
  if (!file.exist) {
    logger.error('Error, File not found!')
    return [];
  } else {
    let addressList = file.content.split('\n'),
      addressObject = {};

    addressList.forEach((address) => {
      if (address.length > 0) {
        addressObject[address] = true;
      }
    });

    return Object.keys(addressObject);
  }
}

module.exports.getPersonsFromCSV = function (filepath) {
  let file = readFile(filepath, '.csv');

  if (!file.exist) {
    logger.error('Error, File not found!')
    return [];
  } else {
    let persons = [],
        records = parse(file.content, {delimiter: ',', relax_column_count: true});

    if (records) {
      for (const r of records) {
        if (r.length === 3) {
          persons.push({
            domain: r[0],
            firstName: r[1],
            lastName: r[2]
          });
        }
      }
    }
    if (!persons.length) {
      logger.error("No correct records found!");
    }
    return persons;
  }
}

function readFile(filepath, expectedExt) {
  let file = {
    exist: true,
    extension: path.extname(filepath),
    content: ''
  }

  if (file.extension !== expectedExt) {
    logger.error("Unexpected file extention. Expexted: " + expectedExt + ", got: " + file.extension)
    throw new Error("Incorrect file extention")
  }

  try {
    file.content = fs.readFileSync(filepath, 'utf-8')
  } catch (e) {
    if (e.code === 'ENOENT') {
      logger.error('File not found!', e);
    } else {
      console.log('Error: ', e);
    }
    file.exist = false;
  } finally {
    return file;
  }
}