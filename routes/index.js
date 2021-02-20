var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var fs = require("fs");
var exceljs = require('exceljs');
var workbook = new exceljs.Workbook();
var Fileware = require('./Fileware');
var parentStartTag = "";
var childStartTag = "";
var childEndTag = "";
var parentEndTag = "";
var value;
var elementsCount = 0;
var outputCode = '';
var filewareObject = new Fileware();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Home'});
});

//router.get('/clingopage', function (req, res, next) {
  //res.
//});

/* POST uploaded file */
router.post('/', function (req, res, next) {
  var fileToConvert = req.file;
  var filePath = './/' + fileToConvert.path; 
  var elementToGenerate = req.body.elementToGenerate;
  var fileExtension = fileToConvert.originalname.substr(-3);
  var options = {
    delimiter: '',
    quote: false
  };

  if (elementToGenerate === "Select element") {
    parentStartTag = "<select> \n";
    childStartTag = "<option value ";
    childEndTag = `</option> \n`;
    parentEndTag = "</select>";
  } else if (elementToGenerate === "Datalist element") {
    parentStartTag = "<datalist> \n";
    childStartTag = "<option value ";
    childEndTag = "\n";
    parentEndTag = "</datalist>";
  }

  //  If a .csv file is uploaded
  if (fileExtension === 'csv') {
    workbook.csv.readFile(filePath, options)
      .then(function () {
        var worksheet = workbook.getWorksheet(1);
        outputCode += parentStartTag;
        if (elementToGenerate === "Select element") {
          worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            elementsCount++;
            value = row.values.toString().substr(1, row.values.toString().length);
            outputCode += `   ${childStartTag}="${value}"> ${value} ${childEndTag}`;
          });
        } else if (elementToGenerate === "Datalist element") {
          worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            elementsCount++;
            value = row.values.toString().substr(1, row.values.toString().length);
            outputCode += `   ${childStartTag}="${value}"> ${childEndTag}`;
          });
        }
        outputCode += parentEndTag;
        res.render('index', { title: 'Home - ', codes: outputCode, listLength: elementsCount });
        outputCode = "";
        elementsCount = 0;

      });
  } else if (fileExtension === 'txt') {
    fs.readFile(filePath, 'utf-8', function (err, data) {
      if (err) throw err;
      // split the contents by new line
      const lines = data.split(/\r?\n/);
      outputCode += parentStartTag;

      if (elementToGenerate === "Select element") {
        // print all lines
        lines.forEach((value) => {
          elementsCount++;
          outputCode += `   ${childStartTag}="${value}"> ${value} ${childEndTag}`;
        });
      } else if (elementToGenerate === "Datalist element") {
        // print all lines
        lines.forEach((value) => {
          elementsCount++;
          outputCode += `   ${childStartTag}="${value}"> ${childEndTag}`;
        });
      }
      outputCode += parentEndTag;
      res.render('index', { title: 'Home - ', codes: outputCode, listLength: elementsCount});
      outputCode = "";
      elementsCount = 0;
    });
  }else{
    
  res.render('index', { title: 'Home - ',codes: "No output because of invaild file format..."});
  }
});

router.get('/:geo/:place/', function (req, res, next) {
  //Ex. world/countries/
  // world/continents/
  // country/states/

  filewareObject.readFile(`${req.params.geo} ${req.params.place}`, function (err, selectOutput, datalistOutput, elementsCount) {
    if (err) {
      return next(createError(404));
      //return res.status(404).send("<h1>404</h1>Not found!");
    }
    var urlPath = req.originalUrl;
    urlPath = urlPath.split('/');
    urlPath.forEach(function (element) {
      var elementR = element.charAt(0).toUpperCase() + element.slice(1);
      var index = urlPath.indexOf(element);
      if (~index) {
        urlPath[index] = elementR;
      }
    });
    var urlPathForTitle = urlPath;
    urlPath = urlPath.join(' >> ');
    urlPathForTitle = urlPathForTitle.join('  ');
    res.render('listView', {
      title: urlPathForTitle,
      otherLinks: urlPath,
      selectCodes: selectOutput,
      datalistCodes: datalistOutput,
      listLength: elementsCount / 2
    });
  });
});

router.get('/:country/:state/lgas/', function (req, res, next) {
  filewareObject.readFile(`${req.params.country.charAt(0).toUpperCase() + req.params.country.slice(1)} LGAs/${req.params.state.charAt(0).toUpperCase() + req.params.state.slice(1)} LGAs`, function (err, selectOutput, datalistOutput, elementsCount) {
    if (err) {
      return next(createError(404));
      //return res.status(404).send("<h1>404</h1>Not found!");
    }
    var urlPath = req.originalUrl;
    urlPath = urlPath.split('/');
    urlPath.forEach(function (element) {
      var elementR = element.charAt(0).toUpperCase() + element.slice(1);
      var index = urlPath.indexOf(element);
      if (~index) {
        urlPath[index] = elementR;
      }
    });
    var urlPathForTitle = urlPath;
    urlPath = urlPath.join(' >> ');
    urlPathForTitle = urlPathForTitle.join('  ');
    res.render('listView', {
      title: urlPathForTitle,
      otherLinks: urlPath,
      selectCodes: selectOutput,
      datalistCodes: datalistOutput,
      listLength: elementsCount / 2
    });
  });
});
module.exports = router;
