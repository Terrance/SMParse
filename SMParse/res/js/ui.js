"use strict";
$(document).ready(function() {
    var arrows = ["<", "V", "\u039b", ">"];
    var rotates = [90, 0, 180, 270];
    var size = 64, zoom = 4;
    function render($canvas, data) {
        var holds = [false, false, false, false];
        var end = data["NOTES"][data["NOTES"].length - 1][0] + 1;
        var margin = ($canvas.width() - (4 * size)) / 2;
        $canvas.clearCanvas().prop("height", Math.min(32767, (end * size * zoom) + size));
        for (var i = 0; i <= end; i++) {
            $canvas.drawLine({
                strokeStyle: "#333",
                strokeWidth: 2,
                x1: 0,
                y1: (i * size * zoom) + (size / 2),
                x2: 512,
                y2: (i * size * zoom) + (size / 2)
            }).drawLine({
                strokeStyle: "#999",
                strokeWidth: 2,
                x1: 0,
                y1: ((i - 0.5) * size * zoom) + (size / 2),
                x2: 512,
                y2: ((i - 0.5) * size * zoom) + (size / 2)
            }).drawLine({
                strokeStyle: "#ccc",
                strokeWidth: 2,
                x1: 0,
                y1: ((i - 0.25) * size * zoom) + (size / 2),
                x2: 512,
                y2: ((i - 0.25) * size * zoom) + (size / 2)
            }).drawLine({
                strokeStyle: "#ccc",
                strokeWidth: 2,
                x1: 0,
                y1: ((i - 0.75) * size * zoom) + (size / 2),
                x2: 512,
                y2: ((i - 0.75) * size * zoom) + (size / 2)
            });
        }
        for (var i in data["NOTES"]) {
            var bar = data["NOTES"][i][0];
            var notes = data["NOTES"][i][1];
            for (var j = 0; j < notes.length; j++) {
                for (var k in notes[j]) {
                    var step = notes[j][k];
                    switch (step) {
                        case "1": // step
                            $canvas.drawImage({
                                source: "res/img/notes.png",
                                x: (k * size) + margin,
                                y: (bar + (j / notes.length)) * size * zoom,
                                width: size,
                                height: size,
                                fromCenter: false,
                                sx: 0,
                                sy: (SMParse.colour(j, notes.length) + 0.5) * 128,
                                sWidth: 128,
                                sHeight: 128,
                                cropFromCenter: false,
                                rotate: rotates[k]
                            });
                            break;
                        case "2": // hold start
                        case "4": // roll start
                            holds[k] = [bar, j, notes.length];
                            break;
                        case "3": // hold/roll stop
                            var hBar = holds[k][0];
                            var hJ = holds[k][1];
                            var hNotesLength = holds[k][2];
                            var hPos = hBar + (hJ / hNotesLength);
                            $canvas.drawImage({
                                source: "res/img/hold.png",
                                x: (k * size) + margin,
                                y: (hPos * size * zoom) + (size / 2),
                                width: size,
                                height: (bar + (j / notes.length) - hPos) * size * zoom,
                                fromCenter: false
                            }).drawImage({
                                source: "res/img/hold-end.png",
                                x: (k * size) + margin,
                                y: ((bar + (j / notes.length)) * size * zoom) + (size / 2),
                                width: size,
                                height: size / 2,
                                fromCenter: false
                            }).drawImage({
                                source: "res/img/notes.png",
                                x: (k * size) + margin,
                                y: hPos * size * zoom,
                                width: size,
                                height: size,
                                fromCenter: false,
                                sx: 0,
                                sy: (SMParse.colour(hJ, hNotesLength) + 0.5) * 128,
                                sWidth: 128,
                                sHeight: 128,
                                cropFromCenter: false,
                                rotate: rotates[k]
                            });
                            holds[k] = false;
                            break;
                    }
                }
            }
        }
    }
    $(window).on("dragover", function(e) {
        e.stopPropagation();
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = "copy";
    }).on("drop", function(e) {
        var files = e.originalEvent.dataTransfer.files;
        if (!files.length) return;
        e.stopPropagation();
        e.preventDefault();
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = SMParse.parse(e.target.result);
            console.log(data);
            $("#data").val(JSON.stringify(data, null, 2));
            render($("#render canvas"), data);
        };
        document.title = files[0].name + " -- StepMania chart parser";
        reader.readAsText(files[0]);
    });
    var imgs = ["notes", "hold", "hold-end"];
    for (var i in imgs) (new Image()).src = "res/img/" + imgs[i] + ".png";
});
