function smParse(str) {
    str = str.replace(/\/\/.*$/gm, "");
    var file = str.split(";");
    var data = {};
    for (var i in file) {
        var parts = file[i].trim().split(":");
        var tag = parts.splice(0, 1)[0].replace(/^#/, "");
        if (parts.length === 1) {
            data[tag] = parts[0];
        } else if (parts.length > 1) {
            data[tag] = parts;
        }
    }
    var listTags = ["ATTACKS", "BGCHANGES", "BPMS", "COMBOS", "DELAYS", "FGCHANGES", "KEYSOUNDS", "LABELS", "SCROLLS", "SPEEDS", "STOPS", "TICKCOUNTS", "TIMESIGNATURES", "WARPS"];
    for (var i in listTags) {
        var tag = listTags[i];
        if (!data.hasOwnProperty(tag)) continue;
        var parts = data[tag].replace(/\s+/gm, "").split(",").filter(function(x) { return !!x; });
        var subdata = {};
        for (var j in parts) {
            var subparts = parts[j].split("=");
            var time = subparts.splice(0, 1)[0];
            if (subparts.length === 1) {
                subdata[time] = subparts[0];
            } else if (subparts.length > 1) {
                subdata[time] = subparts;
            }
        }
        data[tag] = subdata;
    }
    if (typeof data["NOTES"] === "object") {
        var parts = data["NOTES"];
        var notesTags = ["STEPSTYPE", "DESCRIPTION", "DIFFICULTY", "METER", "RADARVALUES", "NOTES"];
        for (var i in notesTags) {
            data[notesTags[i]] = parts[i].trim();
        }
    }
    data["RADARVALUES"] = data["RADARVALUES"].split(",");
    var notes = data["NOTES"].trim().split(/,\s*/);
    for (var i in notes) {
        notes[i] = notes[i].trim().replace(/\s+/gm, " ").split(/\s+/);
    }
    data["NOTES"] = notes;
    return data;
}
