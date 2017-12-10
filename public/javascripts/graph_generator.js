// JavaScript File
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(getDeviceID);

document.addEventListener("DOMContentLoaded", function() {
    // CHeck if there is a token, if not, redirect to signin
    if( !window.localStorage.getItem("token")){
        window.location = "signin.html";
    }
});

function getDeviceID(){
  $.ajax({
      url: '/devices/getDeviceID',
      type: 'GET',
      responseType:'json',
      headers: {'x-auth': window.localStorage.getItem("token") },
      success: drawChart,
      error: function(jqXHR, status, error){
          var response = JSON.parse(jqXHR.responseText);
          $("#chart_div").html("Error: " + response.message);
          $("#chart_div").show();
      }
  });
};

function drawChart(res, status, xhr) {
  var data = new google.visualization.DataTable();
  data.addColumn('datetime', 'Hour');
  data.addColumn('number', 'UV Level');
  var rows = [];
  var range = $("#rangeSelect").value;


  $.get("/data/"+ res["deviceID"], null, function(response){
    var samples = JSON.parse(response).samples;
    if (range == "all") {
      for(var i = 0; i < samples.length; i++){
          rows.push([new Date(samples[i].timeStamp*1000), samples[i].uvIndex]);
      }
    }
    else {
      var max = 0;
      var i = 0;
      var earliestMilli;
      for(i = 0; i < samples.length; i++) {
        if (samples[i].timeStamp > max) { 
          max = samples[i].timeStamp;
        }
      }
      if (range == "hour") earliestMilli = max - 3600;
      else if (range == "day") earliestMilli = max - 86400;
      else if (range == "week") earliestMilli = max - 604800;
      else if (range == "month") earliestMilli = max - 2592000;
      else earliestMilli = max - 31536000;
      for(i = 0; i < samples.length; i++) {
        if (samples[i].timeStamp > earliestMilli) {
          rows.push([new Date(samples[i].timeStamp*1000), samples[i].uvIndex]);
        }
      }
    }

    data.addRows(rows);
    
    var options = {
      title: 'Hourly UV Exposure',
      hAxis: {title: 'Time'},
      vAxis: {title: 'UV Level'},
      legend: 'none',
      lineWidth: 3
    };
  
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
  
    chart.draw(data, options);
  });
}

$("#refresh").click(getDeviceID);
