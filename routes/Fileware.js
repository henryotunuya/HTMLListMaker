var fs = require('fs');
var selectElement = { startTag: "<select>", endTag: "\n </select>" };
var selectOutput = "";
var datalistElement = { startTag: "<datalist>", endTag: "\n </datalist>" };
var datalistOutput = "";

class Fileware {
    constructor() { }
    readFile(filename, callback) {
        fs.readFile(`./public/files/${filename}.txt`, 'utf-8', function (err, data) {
        var selectOutput = selectElement.startTag;
        var datalistOutput = datalistElement.startTag;
        var elementsCount = 0;
            if (err) { return callback(err); }
            else {
                // split the contents by new line
                const lines = data.split(/\r?\n/);
                // print all lines
                lines.forEach((value) => {
                    elementsCount++;
                    selectOutput += `\n <option value = "${value}"> ${value} </option>`;
                    datalistOutput += `\n <option value = "${value}">`;
                });
                selectOutput += selectElement.endTag;
                datalistOutput += datalistElement.endTag;
                console.log(selectOutput);
                callback(err, selectOutput, datalistOutput, elementsCount);
            }
        });
    }
}

module.exports = Fileware;
