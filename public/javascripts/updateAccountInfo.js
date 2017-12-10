function passwordCallBack() {
    $("#extendPassword").removeClass("hidden");
    $("#zipButton").addClass("hidden");
};

function zipCallBack() {
    $("#extendZIP").removeClass("hidden");
    $("#passwordButton").addClass("hidden");
};

$("#passwordButton").click(passwordCallBack);
$("#zipButton").click(zipCallBack);

