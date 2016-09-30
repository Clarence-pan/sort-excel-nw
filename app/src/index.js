try {
    var lastLine = require('./last-line');
    var sortExcel = require('./sort-excel');
    var path = require('path');
    var spawn = require('child_process').spawn;

    $(function () {
        var $inputFile = $('#inputFile');
        var inputFilePath = null;
        var $sortColumn = $('#sortColumn');
        var sortColumn = null;
        var $outputFile = $('#outputFile');
        var outputFilePath = null;
        var $sortBtn = $('#sortBtn');

        $inputFile.on('change', function () {
            try {
                inputFilePath = $(this).val();
                $(this).closest('label').find('.val').text(inputFilePath);

                log("已经选择输入文件: " + inputFilePath + ", 请选择排序哪一列？");

                // 自动选择输出文件
                if (!outputFilePath) {
                    outputFilePath = inputFilePath.replace(/\.xlsx$/i, '_已排序.xlsx');
                    $outputFile.removeClass('disabled');
                    $outputFile.closest('label').find('.val').text(outputFilePath);
                }

                $sortColumn.empty().append('<option value="">--请选择--</option>');

                var columns = sortExcel.parseColumns(inputFilePath);

                $.each(columns, function (i, col) {
                    $sortColumn.append($('<option></option>').attr('value', col).text(col));
                });

                $sortColumn.removeProp('disabled').closest('.row').removeClass('disabled');
                $outputFile.removeProp('disabled').closest('.row').removeClass('disabled');

            } catch (e) {
                log("出现错误：" + e);
            }
        });

        $sortColumn.on('change', function () {
            sortColumn = $(this).val();
            if (sortColumn) {
                log("已经选择排序\"" + sortColumn + "\"");
                $sortBtn.removeProp('disabled').removeClass('disabled').closest('.row').removeClass('disabled');
            }
        });

        $outputFile.on('change', function () {
            outputFilePath = $(this).val();
            $(this).closest('label').find('.val').text(outputFilePath);

            log("已经选择输出文件: " + outputFilePath);
        });

        $sortBtn.on('click', function () {
            if ($sortBtn.is('.disabled')) {
                return;
            }

            try {
                if (!inputFilePath) {
                    throw {$el: $inputFile, message: "请选择输入文件。"};
                }

                if (!sortColumn) {
                    throw {$el: $sortColumn, message: "请选择排序哪一列。"};
                }

                if (!outputFilePath) {
                    throw {$el: $outputFile, message: "请选择输出文件。"};
                }


                $sortBtn.addClass('disabled');

                var start = +new Date();
                log('正在排序"' + sortColumn + '"...');

                sortExcel({
                    inputFile: inputFilePath,
                    outputFile: outputFilePath,
                    columns: [sortColumn],
                });

                log("已经完成排序，耗时" + ((+new Date() - start) / 1000) + "秒。");
                $sortBtn.removeClass('disabled');

                setTimeout(function () {
                    if (window.confirm('已经完成排序。是否立即打开排序好的文件？')) {
                        spawn(path.sep === '/' ? 'open' : 'explorer', [outputFilePath]);
                    }
                });
            } catch (e) {
                $sortBtn.removeClass('disabled');
                if (e.$el) {
                    e.$el.focus();
                    log(e.message);
                    alert(e.message);
                } else {
                    log(e ? e.message || e : e);
                    alert(e ? e.message || e : e);
                }
            }
        });

        log("请选择输入文件。");
    });

} catch (e) {
    log("出现错误：" + e);
}

function log(msg) {
    $('#status').text(lastLine(msg));
    $('<li></li>').text((new Date()).toISOString() + ": " + msg).appendTo('#debug');
}


