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

function updateUserInfo(){
    var updateData;

    if($("#zip").val()){
        updateData = {zip: $("#zip").val()};
    }else if($("#password").val()){
        if($("#password").val() !== $("#passwordConfirm").val()){
            $("#message").html("Passwords do not match");
            $("#message").show();
            return;
        } else{
            updateData = {password: $("#password").val()}; 
        }
    }else{
        $("#message").html("No Info Given");
        $("#message").show();
        return;
    }

    $.ajax({
        url:'/users/update',
        type: 'POST',
        headers: {'x-auth': window.localStorage.getItem("token") },
        data: updateData,
        responseType: 'json',
        success: infoUpdated,
        error: function(jqXHR, status, error){
            var response = JSON.parse(jqXHR.responseText);
            $("#message").html("Error: " + response.message);
            $("#message").show();
        }
    });
}

function infoUpdated(data, status, xhr){
    $("#message").html("Success: " + data["message"]);
    $("#message").show();
}

$("#passSubmit").click(updateUserInfo);
$("#zipSubmit").click(updateUserInfo);
