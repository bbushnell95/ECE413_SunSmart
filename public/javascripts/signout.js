$("#signout").click(function(){
    window.localStorage.removeItem("token");
    window.location = "signin.html";
});
