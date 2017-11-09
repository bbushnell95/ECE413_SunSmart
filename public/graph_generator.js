// JavaScript File
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Hour', 'UV Exposure'],
    [ 12,      1],
    [ 13,      2],
    [ 14,     3],
    [ 15,      4],
    [ 16,      5],
    [ 17,    6]
  ]);

  var options = {
    title: 'Hourly UV Exposure',
    hAxis: {title: 'Time', minValue: 0, maxValue: 23},
    vAxis: {title: 'UV Level', minValue: 1, maxValue: 11},
    legend: 'none'
  };

  var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

  chart.draw(data, options);
}