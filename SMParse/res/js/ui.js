"use strict";
$(document).ready(function() {
    var arrows = ["<", "V", "\u039b", ">"];
    function pad(str, len) {
        while (str.length < len) str = " " + str;
        return str;
    }
    function render(data) {
        var lines = [];
        var last = -1;
        var holds = [false, false, false, false];
        for (var i in data["NOTES"]) {
            var notes = data["NOTES"][i];
            var beat = notes[0];
            var bar = Math.floor(beat / 4);
            var steps = notes.slice(1);
            var line = (bar > last ? pad(bar.toString(), 4) : "    ") + " ";
            var space = (bar > last ? "-" : " ");
            for (var j in steps) {
                line += space;
                switch (steps[j]) {
                    case "0":
                        line += (holds[j] || space);
                        break;
                    case "1":
                        line += arrows[j];
                        break;
                    case "2":
                        holds[j] = "|";
                        line += arrows[j];
                        break;
                    case "4":
                        holds[j] = "\u00a6";
                        line += arrows[j];
                        break;
                    case "3":
                        holds[j] = false;
                        line += "+";
                        break;
                    default:
                        line += steps[j];
                        break;
                }
            }
            lines.push(line + space);
            last = bar;
        }
        return lines.join("\n");
    }
    function parse(str) {
        var data = SMParse.parse(str);
        console.log(data);
        $("#data").val(JSON.stringify(data, null, 2));
        $("#render").val(render(data));
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
            parse(e.target.result);
        };
        document.title = files[0].name + " -- StepMania chart parser";
        reader.readAsText(files[0]);
    });
});
