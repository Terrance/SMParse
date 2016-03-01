"use strict";
var SMParse = {
    notes: {
        "0": null,
        "1": "note",
        "2": "hold start",
        "3": "hold/roll end",
        "4": "roll start",
        "M": "mine",
        "K": "keysound",
        "L": "lift",
        "F": "fake"
    },
    colour: function colour(beat, size) {
        var divs = 3 * 128;
        var val = beat * divs / size;
        if (val % (divs / 4) === 0) {
            return 0;
        } else if (val % (divs / 8) === 0) {
            return 1;
        } else if (val % (divs / 12) === 0) {
            return 2;
        } else if (val % (divs / 16) === 0) {
            return 3;
        } else if (val % (divs / 24) === 0) {
            return 4;
        } else if (val % (divs / 32) === 0) {
            return 5;
        } else if (val % (divs / 64) === 0) {
            return 6;
        } else {
            return 7;
        }
    },
    parse: function parse(str) {
        var lines = str.replace(/\/\/.*$/gm, "").split(";");
        var data = {};
        var notesTags = ["STEPSTYPE", "DESCRIPTION", "DIFFICULTY", "METER", "RADARVALUES", "NOTES"];
        for (var i in lines) {
            var parts = lines[i].trim().split(":");
            parts = [parts.shift(), parts.join(":")];
            var tag = parts.splice(0, 1)[0].replace(/^#/, "");
            var val;
            if (parts.length === 1) {
                val = parts[0];
            } else if (parts.length > 1) {
                val = parts;
            }
            if (tag === "NOTES" && val.indexOf(":") > -1) {
                var nParts = val.split(":");
                for (var j in notesTags) {
                    var nTag = notesTags[j];
                    if (!data[nTag]) data[nTag] = [];
                    data[nTag].push(nParts[j].trim());
                }
            } else if (notesTags.indexOf(tag) > -1) {
                if (!data[tag]) data[tag] = [];
                data[tag].push(val);
            } else {
                data[tag] = val;
            }
        }
        data["SELECTABLE"] = (data["SELECTABLE"] === "YES");
        var listTags = ["ATTACKS", "BGCHANGES", "BPMS", "COMBOS", "DELAYS", "FGCHANGES", "KEYSOUNDS", "LABELS", "SCROLLS", "SPEEDS", "STOPS", "TICKCOUNTS", "TIMESIGNATURES", "WARPS"];
        for (var i in listTags) {
            var tag = listTags[i];
            if (!data[tag]) continue;
            var parts = data[tag].replace(/\s+/gm, "").split(",").filter(function(x) { return !!x; });
            var subdata = [];
            for (var j in parts) {
                var subparts = parts[j].split("=");
                subparts[0] = parseFloat(subparts[0]);
                subdata.push(subparts);
            }
            data[tag] = subdata;
        }
        for (var i in data["NOTES"]) {
            data["RADARVALUES"][i] = data["RADARVALUES"][i].split(",");
            var notes = data["NOTES"][i].trim().split(/,\s*/);
            var bars = [];
            for (var j in notes) {
                var barNotes = notes[j].trim().replace(/\s+/gm, " ").split(/\s+/);
                for (var k in barNotes) {
                    barNotes[k] = barNotes[k].split("");
                }
                bars.push([parseInt(j), barNotes]);
            }
            data["NOTES"][i] = bars;
        }
        return data;
    }
};
