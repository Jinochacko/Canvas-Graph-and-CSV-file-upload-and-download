
var data = [];
var edit_index = '';
var data1 = [{
    value: 0,
    index: 12
}, {
    value: 20,
    index: 28
}, {
    value: 10,
    index: 12
}, {
    value: 40,
    index: 28
}, {
    value: 30,
    index: 18
}, {
    value: 45,
    index: 80
}, {
    value: 70,
    index: 99
}, {
    value: 90,
    index: 40
}, {
    value: 60,
    index: 80
}, {
    value: 70,
    index: 30
}, {
    value: 55,
    index: 80
}];
var data2 = [{
    value: 60,
    index: 80
}, {
    value: 70,
    index: 80
}, {
    value: 55,
    index: 90
}];
function Graph(graph_id) {
    var graph_id = graph_id,
        graph = document.getElementById(graph_id),
        graph_context = graph.getContext("2d"),
        tooltip_id = '';
    this.graph_id = graph_id;
    tip_canvas = document.getElementById('tip');
    tip_context = tip_canvas.getContext("2d");
    if (this.graph_id == 'graph') {
        data = data1;
    } else {
        data = data2;
    }
    this.dots = [];
    var dots = [];
    var offsetX = graph.offsetLeft + 10;
    var offsetY = graph.offsetTop + 35;

    var xPadding = 30;
    var yPadding = 30;

    var data_length = data.length;

    this.createDots = function () {
        for (var i = 0; i < data_length; i++) {
            this.dots.push({
                x: getXPixel(data[i].value),
                y: getYPixel(data[i].index),
                r: 4,
                rXr: 16,
                color: "#00F",
                index: data[i].index,
                value: data[i].value,
                tip: 'Value: ' + data[i].value + ', Index: ' + data[i].index
            });
        }
        dots = this.dots;
    };

    this.drawLine = function (line) {
        if (line.width)
            graph_context.lineWidth = line.width;
        else
            graph_context.lineWidth = 2;
        if (line.color)
            graph_context.strokeStyle = line.color;
        else
            graph_context.strokeStyle = '#000';
        if (line.text_align)
            graph_context.textAlign = line.text_align;
        else
            graph_context.textAlign = 'center';
        graph_context.font = 'italic 8pt sans-serif';
        graph_context.beginPath();
        graph_context.moveTo(line.origin_x, line.origin_y);
        graph_context.lineTo(line.end_x, line.end_y);
        graph_context.stroke();
    };

    this.fillAxisText = function () {
        var line = {};
        line.color = '#ebebeb';
        var max = getMaxvalueAndindex(data);
        /*for (var i = 0; i <= max.value; i+= 10) {
            graph_context.fillText(i, getXPixel(i), graph.height - yPadding + 20);
            
            line.origin_x = getXPixel(i);
            line.origin_y = 0;
            line.end_x = line.origin_x;
            line.end_y = graph.height - yPadding;
            this.drawLine(line);
        }*/

        graph_context.textBaseline = "middle";
        for (var i = 0; i <= max.index; i += 20) {
            if (this.graph_id == 'graph') {
                graph_context.textAlign = "right";
                graph_context.fillText(i, xPadding - 10, getYPixel(i));
                line.origin_x = xPadding;
            } else {
                line.origin_x = 1;
            }

            line.origin_y = getYPixel(i);
            line.end_x = graph.width;
            line.end_y = line.origin_y;
            this.drawLine(line);
        }
        for (var i = 0; i < data_length; i++) {
            line.origin_x = getXPixel(data[i].value);
            line.origin_y = 5;
            line.end_x = line.origin_x;
            line.end_y = graph.height;
            this.drawLine(line);
        }
    };

    this.drawAxis = function () {
        var line = {};
        if (this.graph_id == 'graph')
            line.origin_x = xPadding;
        else
            line.origin_x = 1;
        line.origin_y = 5;
        line.end_x = graph.width;
        line.end_y = 5;
        line.color = '#000837';
        this.drawLine(line);
        line.origin_y = graph.height;
        line.end_y = graph.height;
        this.drawLine(line);
        line.origin_y = 5;
        if (this.graph_id == 'graph')
            line.end_x = xPadding;
        else
            line.end_x = 0;
        line.end_y = graph.height;
        this.drawLine(line);
        if (this.graph_id != 'graph') {
            line.origin_x = graph.width;
            line.origin_y = 5;
            line.end_x = graph.width;
            line.end_y = graph.height;
            this.drawLine(line);
        }
    };

    this.drawLineGraph = function () {
        var line = {};
        line.color = '#FE2E2E';
        line.origin_x = getXPixel(data[0].value);
        line.origin_y = getYPixel(data[0].index);
        for (var i = 1; i < data_length; i++) {
            line.end_x = getXPixel(data[i].value);
            line.end_y = getYPixel(data[i].index);
            this.drawLine(line);
            line.origin_x = getXPixel(data[i].value);
            line.origin_y = getYPixel(data[i].index);
        }
    };

    this.drawDots = function () {
        graph_context.fillStyle = '#333';

        for (var i = 0; i < data_length; i++) {
            graph_context.beginPath();
            graph_context.arc(getXPixel(data[i].value), getYPixel(data[i].index), 4, 0, Math.PI * 2, true);
            graph_context.fill();
        }
    };

    this.drawGraph = function () {
        this.createDots();
        this.fillAxisText();
        this.drawAxis();
        this.drawLineGraph();
        this.drawDots();
        this.bindMouseMove();
    };

    this.addNewEntry = function (xval, yval) {
        var new_xy = {
            value: xval,
            index: yval
        };
        if (this.graph_id == 'graph') {
            data1.push(new_xy);
            data = data1;
        } else {
            data2.push(new_xy);
            data = data2;
        }
        data_length = data.length;
        graph_context.clearRect(0, 0, graph.width, graph.height);
        this.drawGraph();
        clearInputFields();
    }

    this.editOrRemove = function (xval, yval, edit_or_remove) {
        if (this.graph_id == 'graph') {
            data = data1;
        } else {
            data = data2;
        }
        if (edit_or_remove == 'edit') {
            data[edit_index].value = xval;
            data[edit_index].index = yval;
        } else if (edit_or_remove == 'remove' && data[edit_index].value == xval && data[edit_index].index == yval) {
            data.splice(edit_index, 1);
        }
        data_length = data.length;
        graph_context.clearRect(0, 0, graph.width, graph.height);
        this.drawGraph();
        clearInputFields();
    }
    this.setCsvData = function (csv_data) {
        if (this.graph_id == 'graph') {
            data1 = csv_data;
        } else {
            data2 = csv_data;
        }
        data = csv_data;
        data_length = data.length;
        graph_context.clearRect(0, 0, graph.width, graph.height);
        this.drawGraph();
    }
    this.downloadCsv = function () {
        var csv_data = [];
        if (this.graph_id == 'graph') {
            csv_data = data1;
        } else {
            csv_data = data2;
        }
        downloadCsvGraphData(csv_data, { filename: "graph-data.csv" });
    }
    this.bindMouseMove = function () {
        var canvas = {};
        graph.addEventListener('mousemove', function (e) {
            canvas.canvas_id = this.id;
            canvas.canvas_width = document.getElementById(canvas.canvas_id).width;
            handleEvent(e, canvas);
        });
        graph.addEventListener('click', function (e) {
            handleEvent(e, canvas);
        }, false);
        function handleEvent(e) {

            var mouseX = parseFloat(e.offsetX);
            var mouseY = parseFloat(e.offsetY);
            var hit = false;
            var gradient = '';
            for (var i = 0; i < dots.length; i++) {
                var dot = dots[i],
                    left_shift = 0;
                if (canvas.canvas_id == 'graph1')
                    left_shift = canvas.canvas_width;
                if (Math.abs(mouseX - dot.x) < 3 && Math.abs(mouseY - dot.y) < 3) {
                    tip_canvas.style.visibility = "visible";
                    tip_canvas.style.left = (dot.x - 40 + left_shift) + "px";
                    tip_canvas.style.top = (dot.y - 2) + "px";
                    tip_context.clearRect(0, 0, tip_canvas.width, tip_canvas.height);
                    var gradient = tip_context.createLinearGradient(0, 0, tip_canvas.width, 0);
                    gradient.addColorStop("0", "#FFFFFF");
                    tip_context.fillStyle = gradient;
                    tip_context.fillText(dot.tip, 5, 15);
                    hit = true;
                    if (e.type == 'click') {
                        setEditValues(dot);
                    }
                }
            }
            if (!hit) {
                tip_canvas.style.left = "-200px";
                tip_canvas.style.visibility = "hidden";
            }
        }
        function setEditValues(dot) {
            var dots_length = dots.length;
            for (var i = 0; i < dots_length; i++) {
                if (dots[i].value == dot.value && dots[i].index == dot.index) {
                    edit_index = i;
                }
                console.log(edit_index);
            }
            document.getElementById('customX').value = dot.value;
            document.getElementById('customY').value = dot.index;
            if (canvas.canvas_id == 'graph')
                document.getElementById('graphRadio').checked = "checked";
            else
                document.getElementById('graphRadio1').checked = "checked";
            radioCheck();
            showEditAndRemove();
        }
    }

    function showEditAndRemove() {
        document.getElementById('addButton').style.display = 'none';
        document.getElementById('editButton').style.display = 'block';
        document.getElementById('removeButton').style.display = 'block';
        document.getElementById('editButton').style.margin = '0';
    }

    function getMaxvalueAndindex(data) {
        var data_max = getMax(data);
        data1_max = getMax(data1),
        data2_max = getMax(data2);

        function getMax(data2) {
            var max = {};
            max.value = 0;
            max.index = 0;
            for (var i = 0; i < data_length; i++) {
                if (data[i].value > max.value) {
                    max.value = data[i].value;
                }
                if (data[i].index > max.index) {
                    max.index = data[i].index;
                }
            }

            max.value += 10 - max.value % 10;
            max.index += 10 - max.index % 10;

            return max;
        }

        if (data1_max.index > data2_max.index) {
            data_max.index = data1_max.index;
        } else {
            data_max.index = data2_max.index;
        }
        //data_max.index = 100;
        return data_max;
    }
    function getXPixel(val) {
        var max = getMaxvalueAndindex(data);
        return ((graph.width) / (max.value + 1)) * val + xPadding;
    }

    function getYPixel(val) {
        var max = getMaxvalueAndindex(data);
        return (((graph.height - yPadding) / max.index) * val) + 5;
    }


    function clearInputFields() {
        document.getElementById('customX').value = '';
        document.getElementById('customY').value = '';
        document.getElementById('addButton').style.display = 'block';
        document.getElementById('editButton').style.display = 'none';
        document.getElementById('removeButton').style.display = 'none';
        document.getElementById('editButton').style.margin = '0 5%';
    }
}
function setHeight() {
    var win_width = window.innerWidth,
        win_height = window.innerHeight,
        header_height = 63,
        canvas_height = win_height * .6;

    document.getElementById('aside').style.height = win_height - header_height + 'px';
}
function getCheckedRadio() {
    var graph_id = '';
    if (document.getElementById('graphRadio').checked) {
        graph_id = 'graph';
    } else if (document.getElementById('graphRadio1').checked) {
        graph_id = 'graph1';
    }
    return graph_id;
}
function addNewEntry() {
    if (validateInputs()) {
        var xval = parseFloat(document.getElementById('customX').value);
        var yval = parseFloat(document.getElementById('customY').value);
        var graph = new Graph(getCheckedRadio());
        graph.addNewEntry(xval, yval);
    }
}
function downloadCSV() {
    var graph = new Graph(getCheckedRadio());
    graph.downloadCsv();

}
function loadDataFromCsv(csv_data) {
    var graph = new Graph(getCheckedRadio());
    graph.setCsvData(csv_data);
}
function editOrRemoveValues(edit_or_remove) {
    if (validateInputs()) {
        var graph_id = getCheckedRadio(),
            xval = parseFloat(document.getElementById('customX').value),
            yval = parseFloat(document.getElementById('customY').value);
        var graph = new Graph(graph_id);
        graph.editOrRemove(xval, yval, edit_or_remove);
    }
}
function radioCheck() {
    var graph_label = '';
    if (document.getElementById('graphRadio').checked) {
        graph_label = 'Csv Options for Left Graph';
    } else if (document.getElementById('graphRadio1').checked) {
        graph_label = 'Csv Options for Right Graph';
    }
    document.getElementById("csvHead").innerHTML = graph_label;
}
function convertToImage() {
    document.getElementById('canvas_image').src = convertCanvasToImage(document.getElementById(getCheckedRadio())).src;
}
function validateInputs() {
    var is_valid = true,
        xval = document.getElementById('customX').value,
        yval = document.getElementById('customY').value;

    if (yval == '' || yval == undefined || isNaN(yval)) {
        document.getElementById('indexError').style.display = 'block';
        is_valid = false;
    } else {
        document.getElementById('indexError').style.display = 'none';
    }
    if (xval == '' || xval == undefined || isNaN(xval)) {
        document.getElementById('valueError').style.display = 'block';
        is_valid = false;
    } else {
        document.getElementById('valueError').style.display = 'none';
    }
    return is_valid;
}
var graph = new Graph('graph');
graph.drawGraph();
var graph1 = new Graph('graph1');
graph1.drawGraph();

