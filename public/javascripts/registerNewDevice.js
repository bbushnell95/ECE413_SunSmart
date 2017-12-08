// Function to register a new device
function registerDevice(){
    $.ajax({
        url: '/devices/register',
        type: 'POST',
        data: {deviceId: $("#deviceId").val()},
        responseType: 'json',
        success: deviceRegistered,
        error: function(jqXHR, status, error) {
            var response = JSON.parse(jqXHR.responseText);
            $("#message").html("Error: " + response.message);
            $("#message").show();
        }
    });
}

// Device successfully register. Update the list of devices and hide the add device form
function deviceRegistered(data, status, xhr) {
    // Add new device to the device list
    $("#message").html("<li class='collection-item'>`" +
            " APIKEY: " + data["apiKey"] + "</li>")
    $("#message").show()
}

$("#registerDevice").click(registerDevice);
