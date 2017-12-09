

function emailCallBack() {
    $("#extendEmail").removeClass("hidden");
};

function passwordCallBack() {
    $("#extendPassword").slidedown(fast);
};

function zipCallBack() {
    $("#extendZIP").slidedown(fast);
};

$("#emailButton").click(emailCallBack);
$("#passwordButton").click(passwordCallBack);
$("#zipButton").click(zipCallBack);

$("#emailButton").click(function(){
    $("#extendEmail").removeClass("hidden");
});
