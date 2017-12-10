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


document.addEventListener("DOMContentLoaded", function() {
    // CHeck if there is a token, if not, redirect to signin
    if( !window.localStorage.getItem("token")){
        window.location = "signin.html";
    }
});
