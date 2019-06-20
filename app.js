#!/usr/bin/env node

let Promise = require('bluebird'),
    verify = Promise.promisify(require('./index.js').verify),
    argv = process.argv.slice(2),
    files = require('./methods/files.js'),
    addr = require('./methods/addresses.js'),
    loggerOptions = require('./logger.js').loggerOptions,
    logger = require('./logger.js').logger

if (argv.length === 0) {
    throw new Error('You must provide one or more email addresses.')
}

let addresses = [],
  domain = null,
  err_msg = null,
  options = {
    port : 25,
    sender : 'name@example.org',
    fqdn : 'mail.example.org',
    concurrency: 1,
    debug: false,
    timeout: 500
  }

//todo: code refactoring
for (var i = 0 ; i < argv.length ; i++) {
  if (argv[i] === '-d') {
    if (argv[++i]) {
      domain = argv[i];
    } else {
      err_msg = 'Malformed Domain Command';
      break;
    }
  } else if (domain && argv[i] === '-n') {
    if (argv[i + 1] && argv[i + 2]) {
      addr.addAddresses({domain: domain, firstName: argv[++i], lastName: argv[++i]}, addresses);
    } else {
      err_msg = 'Malformed Domain Command'
      break
    }
  }
  else if (domain && argv[i] === '-s') {
    require('./standard.json').addresses.forEach(function (val, index, array) {
      addresses.push(val + domain)
    })
  }
  else if (argv[i] === '-sd' && argv[i+1]) {
    options.sender = argv[++i]
  }
  else if (argv[i] === '-p' && argv[i+1] && argv[i+1] % 1 === 0) {
    options.port = argv[++i]
  }
  else if (argv[i] === '-t' && argv[i+1] && argv[i+1] % 1 === 0) {
    options.timeout = parseInt(argv[++i])
  }
  else if (argv[i] === '-f' && argv[i+1]) {
    options.fqdn = argv[++i]
  }
  else if (argv[i] === '-dns' && argv[i+1]) {
    options.dns = argv[++i]
  }
  else if (argv[i] === '-c' && argv[i+1]) {
    options.concurrency = parseInt(argv[++i])
  }
  else if (argv[i] === '--debug' && argv[i+1]) {
    options.debug = true
  }
  else if (domain) {
    addresses.push(argv[i] + domain)
  }
  else if (argv[i] === '-file' || argv[i] === '--file'){
    // check argv filename supplied?
    if (!argv[i+1]) {
      throw new Error('You must supply the path to the file.')
    } else {
      files.getAddressFromTextFile(argv[i+1])
        .forEach(function (val, index, array) {
          addresses.push(val)
        })
      break // immediately exit to prevent adding the filename itself to the addresses vars
    }
  } else if (argv[i] === '--csv') {
   if (!argv[i+1]) {
      throw new Error('You must supply the path to the file.')
    } else {
      files.getPersonsFromCSV(argv[i+1])
        .forEach(function (val, i, arr) {
          addr.addAddresses(val, addresses);
        })
    }
    break;
  } else {
    addresses.push(argv[i])
  }
}

if (err_msg) {
  console.log(err_msg)
}
else {
  if(options.debug) {
    loggerOptions.enable()
    logger.info('DEBUG')
    logger.info('OPTIONS: ' + JSON.stringify(options))
  }
  Promise.map(addresses, function(val) {

    let individualOptions = Object.assign({email:val},options)

    return verify(individualOptions)
      .then((info) => {
        console.log(info);
      })
      .catch((err) => {
        console.log(err);
      })

  }, {concurrency: options.concurrency})
}
