const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const AdmZip = require('adm-zip');

const XML_FOLDER = `${__dirname}/xml`;
const XML_EXT = '.xml';

const TXT_FOLDER = `${__dirname}/txt`;
const TXT_EXT = '.txt';

const DIST_FOLDER = `${__dirname}/dist`;
const DIST_PACKAGE = 'fr.zip';

function parse_xml(input_file, output_file) {
  var parser = new xml2js.Parser();
  fs.readFile(input_file, (err, data) => {
      parser.parseString(data, (err, result) => {
          var rows = result.Workbook.Worksheet[0].Table[0].Row;
          var texts = [];
          rows.forEach(row => {
            //console.dir(row.Cell[0]);
            let cell = row.Cell[2];
            let data;
            if(cell) data = row.Cell[2].Data;
            if(data) texts.push(data[0]._);
          });
          //console.log(texts);
          fs.writeFile(output_file, texts.join('\n'), (err) => {
            if (err) throw err;
            console.log(`${output_file} is saved!`);
          });
      });
  });
}

function extract_translations() {
  var stop = false;
  fs.readdir(XML_FOLDER, {withFileTypes: true}, (err, dirents) => {
    dirents.forEach(dirent => {
      if(dirent.isFile() && path.extname(dirent.name) === XML_EXT && !stop) {
        var filename = path.basename(dirent.name, XML_EXT);
        //console.log(filename);
        parse_xml(path.join(XML_FOLDER, dirent.name), path.join(TXT_FOLDER, `${filename}${TXT_EXT}`));
      }
    });
  });
}

function pack() {
  fs.access(DIST_FOLDER, (err) => {
    if(err) {
      if(err.code === 'ENOENT') {
        fs.mkdirSync(DIST_FOLDER);
      } else {
        return;
      }
    }
    var zip = new AdmZip();
    fs.readdir(XML_FOLDER, {withFileTypes: true}, (err, dirents) => {
      dirents.forEach(dirent => {
        if(dirent.isFile()) {
          zip.addLocalFile(path.join(XML_FOLDER, dirent.name));
        }
      });
      zip.writeZip(path.join(DIST_FOLDER, DIST_PACKAGE));
    });
  });
}

const args = process.argv.slice(2);

if(args.length > 0) {
  switch(args[0]) {
    case 'extract':
      console.log('Extracting translations from xml files...');
      extract_translations();
      break;
    case 'pack':
      console.log('Building the package to be distributed...');
      pack();
      break;
    default:
      console.log('Wrong script called !');
  }
} else {
  console.log('No script called !');
}
