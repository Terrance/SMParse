$(document).ready(function() {
    $("#load").click(function(e) {
        $.ajax({
            "url": $("#url").val(),
            "success": function(resp, stat, xhr) {
                data = smParse(resp);
                $("#result").text(JSON.stringify(data, null, 2));
                console.log(data);
            },
            "error": function(xhr, stat, err) {
                alert("Failed to load '" + url + "': " + err);
            }
        });
    });
});
