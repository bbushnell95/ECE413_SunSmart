// JavaScript File
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('datetime', 'Hour');
  data.addColumn('number', 'UV Level');
  var rows = [];

  $.get("http://ec2-13-58-73-63.us-east-2.compute.amazonaws.com:3000/data/1a0040000d51353532343635",null, function(response){
    var samples = response.samples;
    for(var i = 0; i < samples.length; i++){
        rows.push([new Date(samples[i].timeStamp*1000), samples[i].uvIndex]);
    }
    
  }, "json");
    

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
}