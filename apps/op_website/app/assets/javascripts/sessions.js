//= require highcharts
$(document).on('ready page:load', function () {

  var highcharts_options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Присъствие в парламентарната зала'
    },
    subtitle: {
      text: 'Дата: 13/23/23'
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45,
        align: 'right',
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Отсъстващи'
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [{
      name: "отсъстващи",
    }]
  }

  function session_id() {
    var url = typeof document.URL === "undefined" ? window.location.href : document.URL;
    // matches the last number in the string.
    return url.match(/\d+(?!.*\d+)/)[0];
  }

  //$.ajax({
    //url: "/sessions/" + session_id() + "/attendance",
    //context: document.body
  //}).done(function(data) {
    //highcharts_options.series[0].data = data;
    //$('#hc-attendance').highcharts(highcharts_options);
  //});

  $.ajax({
    url: "/sessions/" + session_id() + "/votes",
    context: document.body
  }).done(function(data) {
    //highcharts_options.chart.type = "bar"
    highcharts_options.series = data;
    $('#hc-votes').highcharts({
      chart: {
        type: 'column'
      },
      yAxis: {
        plotLines: [{
          color: 'gray',
          dashStyle: 'line',
          value: '120',
          width: '2'
        }]
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
            style: {
              textShadow: '0 0 3px black, 0 0 3px black'
            }
          }
        }
      },
      series: data
    });
  });

});

