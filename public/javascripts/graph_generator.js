// JavaScript File
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart("all"));

function drawChart(range) {
  var data = new google.visualization.DataTable();
  data.addColumn('datetime', 'Hour');
  data.addColumn('number', 'UV Level');
  var rows = [];

  $.get("http://ec2-13-58-73-63.us-east-2.compute.amazonaws.com:3000/data/getData/1a0040000d51353532343635",null, function(response){
    var samples = response.samples;
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
          max = samples[i].max;
        }
      }
      if (range == "hour")
        earliestMilli = max - 3600;
      else if (range == "day")
        earliestMilli = max - 86400;
      else if (range == "week")
        earliestMilli = max - 604800;
      else if (range == "month")
        earliestMilli = max - 2592000;
      else
        earliestMilli = max - 31536000;
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
    
    var rangeChoice = document.createElement("select");
    rangeChoice.innerHTML = "<option value=\"hour\">Last Hour</option><option value=\"day\">Last Day</option><option value=\"week\">Last Week</option><option value=\"month\">Last Month</option><option value=\"year\">Last Year</option>";
    rangeChoice.setAttribute("id", "rangeSelect");
    
    var refreshButton = document.createElement("button");
    refreshButton.setAttribute("type", "button");
    refreshButton.addEventListener("click", function() {
      var range = document.getElementById("rangeSelect").options[document.getElementById("rangeSelect").selectedIndex].value;
      document.getElementById("chart_div").innerHTML = "";
      drawChart(range);
    });
    document.getElementById("chart_div").appendChild(rangeChoice);
    document.getElementById("chart_div").appendChild(refreshButton);
    
    
  }, "json");
    

}