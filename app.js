const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const XML_FOLDER = `${__dirname}/xml`;
const XML_EXT = '.xml';

const TXT_FOLDER = `${__dirname}/txt`;
const TXT_EXT = '.txt';

var stop = false;

fs.readdir(XML_FOLDER, {withFileTypes: true}, (err, dirents) => {
  dirents.forEach(dirent => {
    if(dirent.isFile() && path.extname(dirent.name) === XML_EXT && !stop) {
      var filename = path.basename(dirent.name, XML_EXT);
      //console.log(filename);
      parse_xml(`${XML_FOLDER}/${dirent.name}`, `${TXT_FOLDER}/${filename}.txt`);
    }
  });
});

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
