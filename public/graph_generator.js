// JavaScript File
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('timeofday', 'Hour');
  data.addColumn('number', 'UV Level');

  data.addRows([
    [ [12,0,0], 11],
    [ [13,0,0], 5],
    [ [14,0,0], 3],
    [ [15,0,0], 7],
    [ [16,45,0], 9],
    [ [17,0,0], 1]
  ]);
  
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