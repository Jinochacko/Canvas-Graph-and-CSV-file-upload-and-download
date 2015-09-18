document.getElementById('uploadCsv').addEventListener('change', upload, false);
function upload(evt) {
        var data = null;
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (event) {
            var csvData = event.target.result;
            //data = $.csv.toArrays(csvData);
            data = CSVToArray(csvData);
            var nameArray = data[0];
            var name_array_length = nameArray.length;
            if (name_array_length == 2) {
                data.shift();
                var newArray = [];
                for (var i = 0; i < data.length; i++) {
                    if (
                        data[i][0] != undefined && data[i][0] != null && data[i][0] != '' &&
                        data[i][1] != undefined && data[i][1] != null && data[i][1] != '') {
                        var newObj = {}
                        for (var j = 0; j < name_array_length; j++) {
                            newObj[nameArray[j]] = parseFloat(data[i][j]);
                        }
                        newArray.push(newObj);
                    }
                }
                loadDataFromCsv(newArray);
                csvData = '';
                document.getElementById('uploadCsv').value = '';
            } else {
                document.getElementById('csvErrorMessage').style.display = 'block';
                setTimeout(function () { document.getElementById('csvErrorMessage').style.display = 'none'; }, 3000);
                csvData = '';
                document.getElementById('uploadCsv').value = '';
            }
            function CSVToArray(strData, strDelimiter) {
                strDelimiter = (strDelimiter || ",");

                var objPattern = new RegExp(
                    (
                        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                        // Quoted fields.
                        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                        // Standard fields.
                        "([^\"\\" + strDelimiter + "\\r\\n]*))"
                    ),
                    "gi"
                    );


                var arrData = [[]];
                var arrMatches = null;

                while (arrMatches = objPattern.exec(strData)) {
                    var strMatchedDelimiter = arrMatches[1];
                    if (
                        strMatchedDelimiter.length &&
                        strMatchedDelimiter !== strDelimiter
                        ) {

                        arrData.push([]);

                    }

                    var strMatchedValue;

                    if (arrMatches[2]) {

                        strMatchedValue = arrMatches[2].replace(
                            new RegExp("\"\"", "g"),
                            "\""
                            );

                    } else {

                        strMatchedValue = arrMatches[3];

                    }

                    arrData[arrData.length - 1].push(strMatchedValue);
                }

                return (arrData);
            }
        }
        reader.onerror = function () {
            alert('Unable to read ' + file.fileName);
        };
}
function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function downloadCsvGraphData(array_data, args) {
    var data, filename, link;

    var csv = convertArrayOfObjectsToCSV({
        data: array_data
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}