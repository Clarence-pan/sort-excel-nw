var path = require('path');
var xlsx = require('./xlsx');
var _ = require('lodash');

/**
 *
 * @param options {{inputFile: xxx, outputFile: xxx, sheetName: xxx, columns: [xxx]}}
 * @returns {null}
 */
module.exports = function(options)
{
    if (!options.inputFile){
        throw new Error("No input file!");
    }

    if (!options.outputFile){
        throw new Error("No output file!");
    }

    if (!options.columns){
        throw new Error('No columns to sort!');
    }

    var workbook = xlsx.readFile(options.inputFile, {cellStyles: true});
    if (!workbook){
        throw new Error("读取文件失败！");
    }

    var worksheet = workbook.Sheets[options.sheetName || workbook.SheetNames[0]];
    if (!worksheet){
        throw new Error("找不到指定的工作表或第一张工作表");
    }

    var rows = parseWorksheetRows(worksheet);
    if (rows.length < 3){
        throw new Error("文件数据太少或解析文件失败！");
    }

    var headers = rows.slice(0, 3);
    var data = rows.slice(3);

    if (!headers[1]){
        throw new Error("文件内容格式不正确！第二行应该是序号姓名等信息。");
    }

    // 排序文件
    _.each(headers[1], function(colTitle, colLetter){
        if (colLetter === 'A' || colLetter === 'B'){
            return;
        }

        if (options.columns !== '*'
            && !in_array(colTitle, options.columns)
            && !in_array(colLetter, options.columns)){
            return;
        }


        var sortedData = sortDataByCol(colLetter, data);
        var orderColLetter = nextColLetter(colLetter);
        _.each(sortedData, function(x, order){
            if (x){
                worksheet[orderColLetter + '' + x.row] = _.extend(worksheet[orderColLetter + '' + x.row] || {}, {t: 'n', v: order + 1});
            }
        });
    });

    xlsx.writeFile(workbook, options.outputFile, {cellStyles: true});
    return null;
};

module.exports.parseColumns = function(inputFile, sheetName){
    var workbook = xlsx.readFile(inputFile, {cellStyles: true});
    if (!workbook){
        throw new Error("读取文件失败！");
    }

    var worksheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];
    if (!worksheet){
        throw new Error("找不到指定的工作表或第一张工作表");
    }

    var rows = parseWorksheetRows(worksheet);
    if (rows.length < 3){
        throw new Error("文件数据太少或解析文件失败！");
    }

    var headers = rows.slice(0, 3);
    var columns = _.extend({}, headers[1]||{});
    delete columns['A'];
    delete columns['B'];
    delete columns['row'];
    return columns;
};

function in_array(x, arr)
{
    return arr.indexOf(x) >= 0;
}

function sortDataByCol(col, data)
{
    return _.sortBy(data, function(x){
        return x ? -((+x[col] || -1) * 10000 + (+x.row * -1)) : 0;
    });
}

function nextColLetter(col)
{
    var chars = col.split('');
    var charsLen = chars.length;

    for (var i = charsLen - 1; i >= 0; i++){
        var c = chars[i];
        if (c === 'Z' || c === 'z'){
            continue;
        } else {
            chars[i] = nextChar(c);
            for (i++; i < charsLen; i++){
                chars[i] = 'A';
            }

            return chars.join('');
        }
    }

    return _.range(chars.length + 1).map(function(){return 'A'}).join('');
}

function nextChar(ch)
{
    return String.fromCharCode(ch.charCodeAt(0) + 1);
}

function parseWorksheetColumns(worksheet){
    var columns = {};
    var posRegex = /^([a-zA-Z]+)(\d+)$/;

    for (var pos in worksheet){
        if (!worksheet.hasOwnProperty(pos) || pos[0] === '!'){
            continue;
        }

        var m = posRegex.exec(pos);
        if (!m){
            console.log("Warning: cannot parse pos: " + pos);
            continue;
        }

        var cell = worksheet[pos];
        if (!cell){
            console.log('Warning: empty cell at ' + pos);
            continue;
        }

        var col = m[1];
        var row = +m[2];

        if (typeof columns[col] === 'undefined'){
            columns[col] = {};
        }

        columns[col][row] = cell.v;
    }

    return columns;
}


function parseWorksheetRows(worksheet){
    var rows = {};
    var posRegex = /^([a-zA-Z]+)(\d+)$/;
    var maxRowIndex = 0;

    for (var pos in worksheet){
        if (!worksheet.hasOwnProperty(pos) || pos[0] === '!'){
            continue;
        }

        var m = posRegex.exec(pos);
        if (!m){
            console.log("Warning: cannot parse pos: " + pos);
            continue;
        }

        var cell = worksheet[pos];
        if (!cell){
            console.log('Warning: empty cell at ' + pos);
            continue;
        }

        var col = m[1];
        var row = +m[2];

        if (maxRowIndex < row){
            maxRowIndex = row;
        }

        if (typeof rows[row] === 'undefined'){
            rows[row] = {};
        }

        rows[row][col] = cell.v;
    }

    var orderedRows = [];
    orderedRows.length = maxRowIndex;

    for (var i = 1; i <= maxRowIndex; i++){
        orderedRows[i - 1] = _.extend({row: i}, rows[i]);
    }

    return orderedRows;
}
